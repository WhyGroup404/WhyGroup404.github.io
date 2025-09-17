'use strict';
(function(){
	// DOM elements
	const screen = document.getElementById('screen');
	const cmdline = document.getElementById('cmdline');
	const promptEl = document.getElementById('prompt');
	const fileInput = document.getElementById('fileInput');
	const downloadLink = document.getElementById('downloadLink');
	const statusBar = document.getElementById('statusBar');

	// Storage keys (aligned with main app but independent)
	const STORAGE_KEY = 'rollcall:v1';
	const STORAGE_META_KEY = 'rollcall:v1:meta';
	const PROFILES_KEY = 'rollcall:v1:profiles';
	const getStateKey = (pid) => `rollcall:v1:profile:${pid}`;
	const getMetaKey = (pid) => `rollcall:v1:profile:${pid}:meta`;

	// Helpers
	const nowTs = () => Date.now();
	const genId = () => 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6);

	function createDefaultState(){
		return {
			min: 1, max: 50, exclude: '', noRepeat: true, animate: true,
			roster: '', picked: [], history: [], themeDark: false,
			showRangeBar: true, autoSeconds: 5,
			weightsEnabled: false, weightsMaskEnabled: false, weightsIgnoreNoRepeat: false,
			weightRules: []
		};
	}
	function createDefaultMeta(){ return { noRepeatExpire: 'session', pickedSavedAt: nowTs() }; }

	function loadProfilesStructure(){
		let data = null;
		try { const raw = localStorage.getItem(PROFILES_KEY); if (raw) data = JSON.parse(raw); } catch(_){}
		if (!data || !Array.isArray(data.list)) data = { list: [], currentId: '' };
		if (data.list.length === 0) {
			const id = 'default';
			data.list.push({ id, name: '默认班级' });
			data.currentId = id;
			try { localStorage.setItem(PROFILES_KEY, JSON.stringify(data)); } catch(_){ }
			try { localStorage.setItem(getStateKey(id), JSON.stringify(createDefaultState())); } catch(_){ }
			try { localStorage.setItem(getMetaKey(id), JSON.stringify(createDefaultMeta())); } catch(_){ }
		}
		return data;
	}
	function saveProfilesStructure(data){ try { localStorage.setItem(PROFILES_KEY, JSON.stringify(data)); } catch(_){ } }
	function getCurrentProfileId(){ const data = loadProfilesStructure(); return data.currentId || data.list[0].id; }
	function setCurrentProfile(pid){ const data = loadProfilesStructure(); if (!data.list.some(p=>p.id===pid)) throw new Error('找不到班级：'+pid); data.currentId = pid; saveProfilesStructure(data); return pid; }

	function loadStateAndMeta(pid){
		let s = null, m = null;
		try { const raw = localStorage.getItem(getStateKey(pid)); if (raw) s = JSON.parse(raw); } catch(_){}
		try { const raw = localStorage.getItem(getMetaKey(pid)); if (raw) m = JSON.parse(raw); } catch(_){}
		if (!s) { s = createDefaultState(); try { localStorage.setItem(getStateKey(pid), JSON.stringify(s)); } catch(_){} }
		if (!m) { m = createDefaultMeta(); try { localStorage.setItem(getMetaKey(pid), JSON.stringify(m)); } catch(_){} }
		// TTL for noRepeat
		const savedAt = Number(m.pickedSavedAt) || 0; const now = nowTs();
		let ttlMs = 0; if (m.noRepeatExpire==='40m') ttlMs=40*60*1000; if (m.noRepeatExpire==='1d') ttlMs=24*60*60*1000;
		if (ttlMs>0 && savedAt>0 && now-savedAt>ttlMs) {
			s.picked = []; s.history = [];
			try { localStorage.setItem(getStateKey(pid), JSON.stringify(s)); } catch(_){}
			m.pickedSavedAt = now; try { localStorage.setItem(getMetaKey(pid), JSON.stringify(m)); } catch(_){}
		}
		normalizeState(s);
		return { state: s, meta: m };
	}
	function saveStateAndMeta(pid, state, meta){ try { localStorage.setItem(getStateKey(pid), JSON.stringify(state)); } catch(_){} if (meta) try { localStorage.setItem(getMetaKey(pid), JSON.stringify(meta)); } catch(_){ } }
	function normalizeState(s){ if (!Array.isArray(s.picked)) s.picked=[]; if (!Array.isArray(s.history)) s.history=[]; if (!Array.isArray(s.weightRules)) s.weightRules=[]; }

	// Utils (copied behavior)
	function clampRange(min, max){
		const parseFirstInt = (value, fallback) => { if (Number.isFinite(value)) return Math.floor(value); const m = String(value??'').match(/-?\d+/); return m ? Math.floor(Number(m[0])) : fallback; };
		const a = parseFirstInt(min, 1); const b = parseFirstInt(max, 50);
		if (!Number.isFinite(a) || !Number.isFinite(b)) return [1,50]; if (a>b) return [b,a]; return [a,b];
	}
	function parseExclude(text){ if (!text) return new Set(); const normalized = String(text).replace(/[，、；;\s]+/g, ',').replace(/,+/g, ','); return new Set(normalized.split(/[^-\d]+/).map(s=>s.trim()).filter(Boolean).map(Number).filter(Number.isFinite)); }

	// Roster helpers
	function parseRoster(raw){ const map = new Map(); if (!raw) return map; String(raw).replace(/[\r]+/g,'').split(/\n/).map(s=>s.trim()).filter(Boolean).forEach(line=>{ const m=line.match(/^(\-?\d+)\s+(.+)$/); if(m) map.set(Number(m[1]), m[2].trim()); }); return map; }
	function parseRosterLines(raw){ const lines=String(raw||'').replace(/[\u3000\t]+/g,' ').replace(/[\r]+/g,'').split(/\n/); const entries=[]; const invalid=[]; for(let i=0;i<lines.length;i++){ const line=lines[i].trim(); if(!line) continue; const m=line.match(/^(\-?\d+)\s+(.+)$/); if(m) entries.push({ id: Math.floor(Number(m[1])), name: m[2].replace(/\s+/g,' ').trim() }); else invalid.push({ index:i, text:line }); } return { entries, invalid }; }
	const stringifyRoster = (entries) => entries.map(e=>`${e.id} ${e.name}`).join('\n');
	const normalizeRoster = (raw) => stringifyRoster(parseRosterLines(raw).entries);
	const sortRosterById = (raw) => { const { entries } = parseRosterLines(raw); entries.sort((a,b)=>a.id-b.id || a.name.localeCompare(b.name,'zh-Hans-CN')); return stringifyRoster(entries); };
	const sortRosterByName = (raw) => { const { entries } = parseRosterLines(raw); entries.sort((a,b)=>a.name.localeCompare(b.name,'zh-Hans-CN',{ numeric:true }) || a.id-b.id); return stringifyRoster(entries); };
	const dedupeRosterById = (raw) => { const { entries } = parseRosterLines(raw); const seen=new Set(); const out=[]; for (const e of entries){ if(!seen.has(e.id)){ seen.add(e.id); out.push(e); } } return stringifyRoster(out); };
	const trimRosterEmptyLines = (raw) => String(raw||'').replace(/[\r]+/g,'').split(/\n/).map(s=>s.trim()).filter(Boolean).join('\n');

	// Weighted picker
	function sampleInt(min, max, excludeSet, noRepeat, pickedSet, weightMap, options){
		const weightsEnabled = !!(options && options.weightsEnabled);
		const weightsMaskEnabled = !!(options && options.weightsMaskEnabled);
		const isRolling = !!(options && options.isRolling);
		const weightsIgnoreNoRepeat = !!(options && options.weightsIgnoreNoRepeat);
		let hasPositiveWeightInRange = false; for (let i=min;i<=max;i++){ if (excludeSet.has(i)) continue; if ((Number(weightMap.get(i))||0)>0){ hasPositiveWeightInRange=true; break; } }
		const ignoreNoRepeatActive = !!(noRepeat && weightsIgnoreNoRepeat && hasPositiveWeightInRange);
		const candidates = []; for (let i=min;i<=max;i++){ if (excludeSet.has(i)) continue; if (noRepeat && pickedSet && pickedSet.has(i)){ const isWeightedPositive=(Number(weightMap.get(i))||0)>0; if (!(ignoreNoRepeatActive && isWeightedPositive)) continue; } candidates.push(i); }
		if (candidates.length===0) return null;
		let useWeighted = !!weightsEnabled; if (!useWeighted){ for (let i=0;i<candidates.length;i++){ if ((Number(weightMap.get(candidates[i]))||0)>0){ useWeighted = true; break; } } }
		if (!useWeighted || (weightsMaskEnabled && isRolling)) { const idx = Math.floor(Math.random()*candidates.length); return candidates[idx]; }
		const weights = new Array(candidates.length).fill(0); let assignedTotal=0; let unsetCount=0; for (let i=0;i<candidates.length;i++){ const n=candidates[i]; const p=Number(weightMap.get(n))||0; if (p>0){ weights[i]=p; assignedTotal+=p; } else unsetCount++; }
		if (assignedTotal<100 && unsetCount>0){ const remain=Math.max(0,100-assignedTotal); const avg=remain/unsetCount; for (let i=0;i<candidates.length;i++){ if (weights[i]===0) weights[i]=avg; } }
		let total=0; for (let w of weights) total += Math.max(0,w); if (!(total>0)){ const idx = Math.floor(Math.random()*candidates.length); return candidates[idx]; }
		let r = Math.random()*total; for (let i=0;i<candidates.length;i++){ r -= Math.max(0,weights[i]); if (r<=0) return candidates[i]; } return candidates[candidates.length-1];
	}

	// UI output
	function writeLine(text, cls){ const div=document.createElement('div'); div.className='line'+(cls?(' '+cls):''); div.textContent=String(text); screen.appendChild(div); screen.scrollTop = screen.scrollHeight; return div; }
	function writeHtml(html, cls){ const div=document.createElement('div'); div.className='line'+(cls?(' '+cls):''); div.innerHTML = html; screen.appendChild(div); screen.scrollTop = screen.scrollHeight; return div; }
	function writeObj(obj){ writeLine(JSON.stringify(obj, null, 2)); }
	function ok(msg){ writeLine(msg, 'ok'); }
	function err(msg){ writeLine(msg, 'err'); }
	function showPrompt(){ promptEl.textContent = 'Core>'; }

    // Menu UI helpers
    const HR = '\u2500'.repeat(64); // ────
    let menuMode = true;
    let awaiting = null; // function(text) to handle next Enter input
    let currentView = 'menu';

    function clearScreen(){ screen.innerHTML=''; }

    function enterView(name){
        clearScreen();
        menuMode = false;
        currentView = String(name || '');
        writeHtml('<span class="muted">'+HR+'</span>');
        writeHtml('<span class="accent">当前功能：'+currentView+'</span>');
        writeHtml('<span class="muted">'+HR+'</span>');
        writeHtml('<span class="ok">按 B 返回主菜单</span>');
    }

    function renderMainMenu(){
        clearScreen();
        currentView = 'menu';
		writeHtml('<span class="muted">'+HR+'</span>');
		writeHtml('<span class="accent">功能选项：</span>');
		writeHtml('[1] <span class="accent">设置范围</span>\t\t— 设定最小/最大学号');
		writeHtml('[2] <span class="accent">设置排除</span>\t\t— 例如 3,5,7 或 -1,2');
		writeHtml('[3] <span class="accent">不重复 开/关</span>\t— 已抽不再出现');
		writeHtml('[4] <span class="accent">概率权重 开/关</span>');
		writeHtml('[5] <span class="accent">查看状态</span>\t\t— 当前配置与统计');
		writeHtml('<span class="muted">'+HR+'</span>');
		writeHtml('[7] <span class="accent">抽取一次</span>\t\t— 立即点名');
		writeHtml('[8] <span class="accent">抽取多次</span>\t— 例如 5 次');
		writeHtml('[9] <span class="accent">读秒抽取</span>\t— 1-10 秒');
		writeHtml('<span class="muted">'+HR+'</span>');
		writeHtml('[E] <span class="accent">名单</span>\t\t\t— 粘贴/文件/文本');
		writeHtml('[H] <span class="accent">帮助</span>\t\t\t— 命令行高级用法');
		writeHtml('[0] <span class="accent">清屏</span>');
		writeHtml('<span class="muted">'+HR+'</span>');
		writeHtml('<span class="ok">请按键盘选择 [1,2,3...E,H,0]：</span>');
		menuMode = true; awaiting = null; cmdline.value=''; cmdline.focus();
	}

	function promptInput(question, handler){
		writeHtml('<span class="accent">'+question+'</span>');
		menuMode = false; // disable single-key menu shortcuts while entering text
		awaiting = (text) => { awaiting = null; handler(String(text||'').trim()); };
		cmdline.value=''; cmdline.focus();
	}

	function handleMenuKey(key){
        switch (key.toUpperCase()){
            case '1':
                enterView('范围设置');
                promptInput('输入最小值（整数）：', (min) => {
					if (!/^\-?\d+$/.test(min)) { err('请输入整数'); return renderMainMenu(); }
                    promptInput('输入最大值（整数）：', (max) => {
						if (!/^\-?\d+$/.test(max)) { err('请输入整数'); return renderMainMenu(); }
                        if (Number(min) >= Number(max)) { err('最小值必须小于最大值'); return renderMainMenu(); }
                        try { cmdRange([min, max]); ok('范围已设置为 '+min+' - '+max); } catch(ex){ err(ex.message||String(ex)); }
						renderMainMenu();
					});
				});
				break;
			case '2':
                enterView('设置排除');
                promptInput('输入排除列表（例如：1,2,5-7）：', (v) => { try { cmdExclude([v]); ok('已设置排除'); } catch(ex){ err(ex.message||String(ex)); } renderMainMenu(); });
				break;
			case '3':
				// toggle repeat (noRepeat)
				try {
					const before = getCurrent().state.noRepeat;
					cmdRepeat([ before ? 'on' : 'off' ]);
					const after = getCurrent().state.noRepeat;
					ok('已切换为：'+(after ? '不重复' : '允许重复'));
				} catch(ex){ err(ex.message||String(ex)); }
				renderMainMenu();
				break;
			case '4':
				try {
					const before = getCurrent().state.weightsEnabled;
					cmdWeightsSimple([ before ? 'off' : 'on' ]);
					const after = getCurrent().state.weightsEnabled;
					ok('概率权重：'+(after?'开启':'关闭'));
				} catch(ex){ err(ex.message||String(ex)); }
				renderMainMenu();
				break;
            case '5':
                enterView('查看状态');
                summarize();
				writeHtml('<span class="ok">按 Enter 返回菜单</span>');
				awaiting = () => renderMainMenu();
				break;
			case '7':
                enterView('抽取一次');
                try { cmdPick(['1']); } catch(ex){ err(ex.message||String(ex)); }
				writeHtml('<span class="ok">按 Enter 返回菜单</span>');
				awaiting = () => renderMainMenu();
				break;
			case '8':
                enterView('抽取多次');
                promptInput('输入抽取次数（整数）：', (n) => { if (!/^\d+$/.test(n)) { err('请输入整数'); return renderMainMenu(); } try { cmdPick([n]); } catch(ex){ err(ex.message||String(ex)); } writeHtml('<span class=\"ok\">按 Enter 返回菜单</span>'); awaiting = () => renderMainMenu(); });
				break;
			case '9':
                enterView('读秒抽取');
                promptInput('输入读秒秒数（1-10）：', (s) => { if (!/^\d+$/.test(s)) { err('请输入 1-10 的整数'); return renderMainMenu(); } try { cmdAuto([s]); } catch(ex){ err(ex.message||String(ex)); } writeHtml('<span class="ok">完成后按 Enter 返回菜单</span>'); awaiting = () => renderMainMenu(); });
				break;
			case 'E':
                enterView('名单');
                writeHtml('[1] 粘贴名单（从剪贴板）');
				writeHtml('[2] 从文件导入名单');
				writeHtml('[3] 直接输入文本');
				writeHtml('[4] 导出班级配置');
				writeHtml('[5] 导入班级配置');
				writeHtml('<span class="ok">请选择 [1..5]：</span>');
				awaiting = (choice) => {
					const c = String(choice||'').trim();
					if (c==='1') { cmdRosterSimple(['paste']); ok('已从剪贴板尝试读取'); renderMainMenu(); return; }
					if (c==='2') { cmdRosterSimple(['file']); writeHtml('<span class="muted">已打开文件选择器</span>'); awaiting = () => renderMainMenu(); return; }
					if (c==='3') { promptInput('粘贴名单文本：', (text)=>{ cmdRosterSimple(['text', text]); renderMainMenu(); }); return; }
					if (c==='4') { cmdExport([]); renderMainMenu(); return; }
					if (c==='5') { cmdImport(); writeHtml('<span class="muted">已打开文件选择器</span>'); awaiting = () => renderMainMenu(); return; }
					renderMainMenu();
				};
				break;
			case 'H':
                enterView('帮助');
                usage();
				writeHtml('<span class="ok">按 Enter 返回菜单</span>'); awaiting = () => renderMainMenu();
				break;
			case '0':
				clearScreen(); renderMainMenu();
				break;
			default:
				// ignore
		}
	}

	// History
	const history = []; let historyIdx = -1; function pushHistory(cmd){ if (cmd.trim()) history.push(cmd); historyIdx = history.length; }

	// Tokenize with simple quotes support
	function tokenize(input){
		const out=[]; let i=0; let cur=''; let quote=null;
		while (i<input.length){
			const ch = input[i++];
			if (quote){ if (ch===quote){ out.push(cur); cur=''; quote=null; } else { cur+=ch; } continue; }
			if (ch==='"' || ch==='\''){ quote=ch; continue; }
			if (/\s/.test(ch)){ if (cur){ out.push(cur); cur=''; } continue; }
			cur+=ch;
		}
		if (cur) out.push(cur);
		return out;
	}

	function usage(){
		writeLine('Core模式（内核 v3.1.0）简化命令：');
		writeLine('  range <min> <max>                 设置范围');
		writeLine('  exclude <列表>                    设置排除，如 3,5,7');
		writeLine('  repeat on|off                     允许重复 或 不重复点到');
		writeLine('  pick [N]                          抽取 N 次（默认 1 次）');
		writeLine('  auto <秒>                         模拟读秒后抽取 1 次');
		writeLine('  undo                              撤销最后一次抽取');
		writeLine('  clearpicked                       清空“不重复”与历史');
		writeLine('  show [config|roster|weights|history|profiles]');
		writeLine('  weights on|off                    启用/关闭概率权重');
		writeLine('  weight <学号> <百分比>            设置指定学号的百分比');
		writeLine('  weightgroup "1,2,5-10"            批量添加学号（默认0%）');
		writeLine('  roster file|paste|text <文本>     设置名单');
		writeLine('  export [文件] / import            导出/导入班级配置');
		writeLine('  help / clear                      帮助 / 清屏');
		writeLine('高级命令（兼容旧版）：profile/state/expire/picked/roster/weights/roll/history');
	}

	// File import handling
	let pendingFileAction = null; // { type: 'roster' | 'profile', callback }
	fileInput.addEventListener('change', (e)=>{
		const file = e.target.files && e.target.files[0];
		e.target.value = '';
		if (!file || !pendingFileAction) return;
		const reader = new FileReader();
		reader.onload = () => {
			try { pendingFileAction.callback(String(reader.result||'')); }
			catch (ex) { err('导入失败：'+(ex && ex.message ? ex.message : ex)); }
			finally { pendingFileAction = null; }
		};
		reader.readAsText(file);
	});

	async function readClipboardText(){ try { return await navigator.clipboard.readText(); } catch(_){ return ''; } }

	// Commands
	function getCurrent(){ const pid=getCurrentProfileId(); const { state, meta } = loadStateAndMeta(pid); return { pid, state, meta }; }

	function cmdProfile(args){
		const sub = args[0]||'list';
		const data = loadProfilesStructure();
		if (sub==='list') { const cur = data.currentId; data.list.forEach(p=>writeLine((p.id===cur?'* ':'  ')+p.id+'\t'+p.name)); return; }
		if (sub==='new') { const name = args.slice(1).join(' ') || '新建班级'; const id = genId(); data.list.push({ id, name }); saveProfilesStructure(data); localStorage.setItem(getStateKey(id), JSON.stringify(createDefaultState())); localStorage.setItem(getMetaKey(id), JSON.stringify(createDefaultMeta())); ok('已创建：'+id+' '+name); return; }
		if (sub==='use') { const id=args[1]; if(!id) throw new Error('缺少 id'); setCurrentProfile(id); ok('已切换到：'+id); return; }
		if (sub==='rename') { const id=args[1]; const name=args.slice(2).join(' '); if(!id||!name) throw new Error('用法：profile rename <id> <新名称>'); const p=data.list.find(x=>x.id===id); if(!p) throw new Error('找不到班级：'+id); p.name=String(name); saveProfilesStructure(data); ok('已重命名：'+id+' -> '+name); return; }
		if (sub==='delete') { const id=args[1]; if(!id) throw new Error('缺少 id'); if (data.list.length<=1) throw new Error('至少保留一个班级'); const idx=data.list.findIndex(x=>x.id===id); if(idx<0) throw new Error('找不到班级：'+id); data.list.splice(idx,1); if (data.currentId===id) data.currentId=data.list[0].id; saveProfilesStructure(data); ok('已删除：'+id); return; }
		if (sub==='export') { const file = args[1] || ('rollcall_profile_'+(data.list.find(p=>p.id===data.currentId)?.name||'未命名班级')+'.json'); const pid=data.currentId; const state = JSON.parse(localStorage.getItem(getStateKey(pid))||'{}'); const meta = JSON.parse(localStorage.getItem(getMetaKey(pid))||'{}'); const payload = { type:'rollcall-profile', version:1, name:(data.list.find(p=>p.id===pid)?.name||'未命名班级'), state, meta }; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); downloadLink.href=url; downloadLink.download=file; downloadLink.click(); setTimeout(()=>URL.revokeObjectURL(url), 1000); ok('已导出到 '+file); return; }
		if (sub==='import') { pendingFileAction = { type:'profile', callback: (text)=>{ const obj=JSON.parse(text||'{}'); const name=String(obj&&obj.name)||'导入班级'; const state=obj&&obj.state?obj.state:obj; if(!state||typeof state!=='object') throw new Error('导入文件格式不正确'); if(!Array.isArray(state.weightRules)) state.weightRules=[]; if(!Array.isArray(state.picked)) state.picked=[]; if(!Array.isArray(state.history)) state.history=[]; const id=genId(); data.list.push({ id, name }); saveProfilesStructure(data); localStorage.setItem(getStateKey(id), JSON.stringify(state)); if (obj && obj.meta) localStorage.setItem(getMetaKey(id), JSON.stringify(obj.meta)); ok('导入成功：'+id+' '+name); } }; fileInput.click(); return; }
		throw new Error('未知子命令: profile '+sub);
	}

	function cmdState(args){
		const sub = args[0]||'show';
		const { pid, state, meta } = getCurrent();
		if (sub==='show'){ writeObj({ profileId: pid, state, meta }); return; }
		if (sub==='set'){
			let i=1; while (i<args.length){ const key=args[i++]; const val=args[i]; if(val===undefined) break; i++; if (key==='min') state.min=Number(val); else if (key==='max') state.max=Number(val); else if (key==='exclude') state.exclude=String(val); else if (key==='noRepeat') state.noRepeat=/^(1|true|yes)$/i.test(String(val)); else if (key==='weightsEnabled') state.weightsEnabled=/^(1|true|yes)$/i.test(String(val)); else throw new Error('不支持的键：'+key); }
			saveStateAndMeta(pid, state, meta); ok('已更新'); return;
		}
		throw new Error('未知子命令: state '+sub);
	}

	function cmdExpire(args){ const sub=args[0]||'show'; const { pid, state, meta } = getCurrent(); if (sub==='show'){ writeLine(meta.noRepeatExpire||'session'); return; } if (sub==='set'){ const mode=args[1]; if(!/^(session|40m|1d)$/.test(String(mode))) throw new Error('值必须为 session|40m|1d'); meta.noRepeatExpire=mode; meta.pickedSavedAt=nowTs(); saveStateAndMeta(pid,state,meta); ok('已设置过期策略为 '+mode); return; } throw new Error('未知子命令: expire '+sub); }

	function cmdPicked(args){ const sub=args[0]; if (sub==='clear'){ const { pid, state, meta }=getCurrent(); state.picked=[]; state.history=[]; meta.pickedSavedAt=nowTs(); saveStateAndMeta(pid,state,meta); ok('已清空'); return; } throw new Error('未知子命令: picked '+sub); }

	function cmdRoster(args){
		const sub = args[0]||'show';
		const { pid, state, meta } = getCurrent();
		if (sub==='show'){ writeLine(state.roster||''); return; }
		if (sub==='set'){
			const mode=args[1];
			if (mode==='--file'){ pendingFileAction = { type:'roster', callback: (text)=>{ state.roster=String(text||''); saveStateAndMeta(pid,state,meta); ok('已更新名单'); } }; fileInput.click(); return; }
			if (mode==='--text'){ const text=args.slice(2).join(' '); state.roster = text; saveStateAndMeta(pid,state,meta); ok('已更新名单'); return; }
			if (mode==='--paste'){ readClipboardText().then(text=>{ state.roster=String(text||''); saveStateAndMeta(pid,state,meta); ok('已更新名单(剪贴板)'); }).catch(()=>err('读取剪贴板失败')); return; }
			throw new Error('用法：roster set --file | --text <文本> | --paste');
		}
		if (sub==='tool'){
			const action=args[1]; const raw=state.roster||''; let out=raw;
			if (action==='format') out=normalizeRoster(raw);
			else if (action==='sort-id') out=sortRosterById(raw);
			else if (action==='sort-name') out=sortRosterByName(raw);
			else if (action==='dedupe') out=dedupeRosterById(raw);
			else if (action==='trim') out=trimRosterEmptyLines(raw);
			else throw new Error('未知工具：'+action);
			state.roster=out; saveStateAndMeta(pid,state,meta); ok('已应用：'+action); return;
		}
		throw new Error('未知子命令: roster '+sub);
	}

	function cmdWeights(args){
		const sub=args[0]||'list'; const { pid, state, meta }=getCurrent(); state.weightRules=Array.isArray(state.weightRules)?state.weightRules:[]; const map=new Map(state.weightRules.map(x=>[Number(x.id), Number(x.percent)]));
		if (sub==='enable'){ state.weightsEnabled=/^(1|true|yes)$/i.test(String(args[1])); saveStateAndMeta(pid,state,meta); writeLine('weightsEnabled='+state.weightsEnabled); return; }
		if (sub==='mask'){ state.weightsMaskEnabled=/^(1|true|yes)$/i.test(String(args[1])); saveStateAndMeta(pid,state,meta); writeLine('weightsMaskEnabled='+state.weightsMaskEnabled); return; }
		if (sub==='ignoreNR'){ state.weightsIgnoreNoRepeat=/^(1|true|yes)$/i.test(String(args[1])); saveStateAndMeta(pid,state,meta); writeLine('weightsIgnoreNoRepeat='+state.weightsIgnoreNoRepeat); return; }
		if (sub==='list'){ const arr=Array.from(map.entries()).sort((a,b)=>a[0]-b[0]).map(([id,p])=>({id,percent:p})); writeObj(arr); return; }
		if (sub==='add'){ const id=Math.floor(Number(args[1])); const percent=Math.max(0, Math.floor(Number(args[2]))||0); if(!Number.isFinite(id)) throw new Error('学号需为整数'); map.set(id, percent); state.weightRules = Array.from(map.entries()).map(([id,percent])=>({id,percent})); saveStateAndMeta(pid,state,meta); ok('已设置：'+id+' -> '+percent+'%'); return; }
		if (sub==='add-group'){ const text=args[1]; if(!text) throw new Error('缺少学号组'); const ids=new Set(); let hasInvalid=false; String(text).split(/[,，\s]+/).filter(Boolean).forEach(tok=>{ if(!/^\-?\d+(\s*-\s*\-?\d+)?$/.test(tok)){ hasInvalid=true; return; } const m=tok.match(/^(\-?\d+)\s*-\s*(\-?\d+)$/); if(m){ let a=Math.floor(Number(m[1])); let b=Math.floor(Number(m[2])); if(Number.isFinite(a)&&Number.isFinite(b)){ if(a>b) [a,b]=[b,a]; for(let i=a;i<=b;i++) ids.add(i); } else { hasInvalid=true; } } else { const n=Math.floor(Number(tok)); if(Number.isFinite(n)) ids.add(n); else hasInvalid=true; } }); if (hasInvalid||ids.size===0) throw new Error('存在非法输入，示例：1,2,5-10'); ids.forEach(n=>{ if(!map.has(n)) map.set(n,0); }); state.weightRules=Array.from(map.entries()).map(([id,percent])=>({id,percent})); saveStateAndMeta(pid,state,meta); ok('已添加 '+ids.size+' 个学号'); return; }
		if (sub==='clear'){ state.weightRules=[]; saveStateAndMeta(pid,state,meta); ok('已清空权重'); return; }
		if (sub==='total'){ const [min,max]=clampRange(state.min,state.max); const excludeSet=parseExclude(state.exclude); const pickedSet=new Set(state.picked||[]); let total=0; for (const [id,p] of map.entries()){ const ignoreNR=!!(state.noRepeat && state.weightsIgnoreNoRepeat); if (id>=min && id<=max && !excludeSet.has(id) && (!state.noRepeat || ignoreNR || !pickedSet.has(id))){ total += Math.max(0, Number(p)||0); } } writeLine(total+'%'); return; }
		throw new Error('未知子命令: weights '+sub);
	}

	function cmdRoll(args){ const { pid, state, meta }=getCurrent(); const [min,max]=clampRange(state.min,state.max); const excludeSet=parseExclude(state.exclude); const pickedSet=new Set(state.picked||[]); const weightMap=new Map((state.weightRules||[]).map(x=>[Number(x.id), Number(x.percent)])); let count=1; const idx=args.indexOf('--count'); if (idx>=0 && args[idx+1]) count=Math.max(1, Math.floor(Number(args[idx+1]))||1); const roster=parseRoster(state.roster); for (let k=0;k<count;k++){ const n=sampleInt(min,max,excludeSet,!!state.noRepeat,pickedSet,weightMap,{weightsEnabled:!!state.weightsEnabled, weightsMaskEnabled:!!state.weightsMaskEnabled, weightsIgnoreNoRepeat:!!state.weightsIgnoreNoRepeat, isRolling:false}); if (n==null){ err('无可选学号'); break; } const name=roster.get(n)||''; writeLine(name?(`${n}\t${name}`):String(n)); if (state.noRepeat) pickedSet.add(n); state.history.push({ number:n, name, time: new Date().toLocaleString() }); }
		state.picked = Array.from(pickedSet); meta.pickedSavedAt = nowTs(); saveStateAndMeta(pid,state,meta);
	}

	function cmdHistory(args){ const sub=args[0]||'show'; const { pid, state, meta }=getCurrent(); if (sub==='show'){ writeObj(state.history||[]); return; } if (sub==='undo'){ const last=(state.history||[]).pop(); if (last){ const idx=state.picked.indexOf(last.number); if (idx>=0) state.picked.splice(idx,1); saveStateAndMeta(pid,state,meta); ok('已撤销：'+last.number+(last.name?(' '+last.name):'')); } else { writeLine('无历史'); } return; } if (sub==='clear'){ state.history=[]; saveStateAndMeta(pid,state,meta); ok('已清空历史'); return; } throw new Error('未知子命令: history '+sub); }

	// Simplified commands
	function cmdRange(args){ const a=Number(args[0]); const b=Number(args[1]); if(!Number.isFinite(a)||!Number.isFinite(b)) throw new Error('用法：range <min> <max>'); const { pid, state, meta }=getCurrent(); state.min=a; state.max=b; saveStateAndMeta(pid,state,meta); ok('范围已设置：'+a+' - '+b); }
	function cmdExclude(args){ const text=args.join(' '); const { pid, state, meta }=getCurrent(); state.exclude=String(text||''); saveStateAndMeta(pid,state,meta); ok('排除已设置'); }
	function cmdRepeat(args){ const onoff=(args[0]||'').toLowerCase(); if(!/^(on|off)$/.test(onoff)) throw new Error('用法：repeat on|off'); const { pid, state, meta }=getCurrent(); state.noRepeat = (onoff==='off'); saveStateAndMeta(pid,state,meta); ok('不重复点到：'+(state.noRepeat?'开启':'关闭')); }
	function cmdPick(args){ let n=1; if (args[0] && /^\d+$/.test(args[0])) n=Math.max(1,Math.floor(Number(args[0]))||1); return cmdRoll(['--count', String(n)]); }
	function cmdUndo(){ return cmdHistory(['undo']); }
	function cmdClearPicked(){ const { pid, state, meta }=getCurrent(); state.picked=[]; state.history=[]; meta.pickedSavedAt=nowTs(); saveStateAndMeta(pid,state,meta); ok('已清空'); }
	function summarize(){ const data=loadProfilesStructure(); const { pid, state, meta }=getCurrent(); const profile=data.list.find(p=>p.id===pid); const [min,max]=clampRange(state.min,state.max); const exclude=state.exclude||''; const repeat = state.noRepeat ? '不重复' : '允许重复'; const rosterSize = parseRoster(state.roster).size; const map=new Map((state.weightRules||[]).map(x=>[Number(x.id),Number(x.percent)])); const excludeSet=parseExclude(exclude); const pickedSet=new Set(state.picked||[]); let total=0; for(const [id,p] of map.entries()){ const ignoreNR=!!(state.noRepeat && state.weightsIgnoreNoRepeat); if(id>=min && id<=max && !excludeSet.has(id) && (!state.noRepeat || ignoreNR || !pickedSet.has(id))) total+=Math.max(0, Number(p)||0); } const summary={ profile: (profile?profile.name:'-')+' ('+pid+')', range: `${min}-${max}`, exclude, repeat, roster: `${rosterSize} 人`, weightsEnabled: !!state.weightsEnabled, weightsTotal: `${total}%`, pickedCount: (state.picked||[]).length, historyCount: (state.history||[]).length, expire: meta.noRepeatExpire||'session' }; writeObj(summary); }

	function updateStatusBar(){
		const data = loadProfilesStructure();
		const { pid, state } = getCurrent();
		const profile = data.list.find(p=>p.id===pid);
		const [min, max] = clampRange(state.min, state.max);
		const parts = [];
		parts.push('<span class="badge">班级: '+(profile?profile.name:'未命名')+'</span>');
		parts.push('<span class="badge">范围: '+min+'-'+max+'</span>');
		parts.push('<span class="badge">不重复: '+(state.noRepeat?'开':'关')+'</span>');
		parts.push('<span class="badge">权重: '+(state.weightsEnabled?'开':'关')+'</span>');
		parts.push('<span class="badge">名单: '+parseRoster(state.roster).size+' 人</span>');
		statusBar.innerHTML = parts.join(' ');
	}
	function cmdShow(args){ const sub=(args[0]||'').toLowerCase(); if(!sub||sub==='config'){ summarize(); return; } if(sub==='roster'){ const { state }=getCurrent(); writeLine(state.roster||''); return; } if(sub==='weights'){ return cmdWeights(['list']); } if(sub==='history'){ return cmdHistory(['show']); } if(sub==='profiles'){ const data=loadProfilesStructure(); const cur=data.currentId; data.list.forEach(p=>writeLine((p.id===cur?'* ':'  ')+p.id+'\t'+p.name)); return; } throw new Error('用法：show [config|roster|weights|history|profiles]'); }
	function cmdWeightsSimple(args){ const sub=(args[0]||'').toLowerCase(); if(sub==='on') return cmdWeights(['enable','true']); if(sub==='off') return cmdWeights(['enable','false']); throw new Error('用法：weights on|off'); }
	function cmdWeight(args){ const id=args[0]; const percent=args[1]; if(!/^\-?\d+$/.test(String(id))||!/^\d+$/.test(String(percent||''))) throw new Error('用法：weight <学号> <百分比>'); return cmdWeights(['add', String(id), String(percent)]); }
	function cmdWeightGroup(args){ const text=args.join(' '); if(!text) throw new Error('用法：weightgroup "1,2,5-10"'); return cmdWeights(['add-group', text]); }
	function cmdRosterSimple(args){ const sub=(args[0]||'').toLowerCase(); if(sub==='file') return cmdRoster(['set','--file']); if(sub==='paste') return cmdRoster(['set','--paste']); if(sub==='text'){ const text=args.slice(1).join(' '); return cmdRoster(['set','--text', text]); } throw new Error('用法：roster file|paste|text <文本>'); }
	function cmdExport(args){ return cmdProfile(['export'].concat(args||[])); }
	function cmdImport(){ return cmdProfile(['import']); }
	function cmdAuto(args){ let sec = Math.max(1, Math.floor(Number(args[0])||0)); if(!Number.isFinite(sec)) sec=3; const line = writeLine('读秒：'+sec+'s'); const start=performance.now(); const dur=sec*1000; function tick(){ const now=performance.now(); const passed=now-start; const remain=Math.max(0, dur-passed); const s=Math.ceil(remain/1000); line.textContent='读秒：'+s+'s'; if (remain>0) requestAnimationFrame(tick); else { ok('时间到'); cmdPick(['1']); } } requestAnimationFrame(tick); }

	function handleCommand(input){
		const args = tokenize(input);
		if (args.length===0) return;
		const cmd = args.shift();
		if (cmd==='help'){ usage(); return; }
		if (cmd==='clear'){ screen.innerHTML=''; return; }
		// simplified aliases
		if (cmd==='range'){ return cmdRange(args); }
		if (cmd==='exclude'){ return cmdExclude(args); }
		if (cmd==='repeat'){ return cmdRepeat(args); }
		if (cmd==='pick'){ return cmdPick(args); }
		if (cmd==='auto'){ return cmdAuto(args); }
		if (cmd==='undo'){ return cmdUndo(); }
		if (cmd==='clearpicked'){ return cmdClearPicked(); }
		if (cmd==='show'){ return cmdShow(args); }
		if (cmd==='weights' && (args[0]==='on' || args[0]==='off')){ return cmdWeightsSimple(args); }
		if (cmd==='weight'){ return cmdWeight(args); }
		if (cmd==='weightgroup'){ return cmdWeightGroup(args); }
		if (cmd==='roster' && (args[0]==='file' || args[0]==='paste' || args[0]==='text')){ return cmdRosterSimple(args); }
		if (cmd==='export'){ return cmdExport(args); }
		if (cmd==='import'){ return cmdImport(); }

		// advanced
		if (cmd==='profile'){ return cmdProfile(args); }
		if (cmd==='state'){ return cmdState(args); }
		if (cmd==='expire'){ return cmdExpire(args); }
		if (cmd==='picked'){ return cmdPicked(args); }
		if (cmd==='roster'){ return cmdRoster(args); }
		if (cmd==='weights'){ return cmdWeights(args); }
		if (cmd==='roll'){ return cmdRoll(args); }
		if (cmd==='history'){ return cmdHistory(args); }
		throw new Error('未知命令：'+cmd);
	}

	// Keyboard and boot
	cmdline.addEventListener('keydown', (e)=>{
		// Global back to menu shortcut
		if (e.key==='b' || e.key==='B'){
			e.preventDefault();
			awaiting = null;
			renderMainMenu();
			return;
		}
		if (e.key==='Enter'){
			const input = cmdline.value.trim();
			if (awaiting){
				const fn = awaiting; awaiting = null;
				writeLine('>> '+input);
				try { fn(input); } catch(ex){ err(ex && ex.message ? ex.message : String(ex)); }
				cmdline.value='';
				return;
			}
			if (!input) return;
			writeLine('Core> '+input, '');
			pushHistory(input);
			cmdline.value='';
			try { handleCommand(input); }
			catch (ex) { err(ex && ex.message ? ex.message : String(ex)); }
			return;
		}
        if (menuMode){
            // single key menu shortcuts (digits / E / H). Handle Shift+key too.
            const key = e.key;
            if (!e.isComposing && key && key.length === 1 && (/^[0-9]$/.test(key) || /^[eEhH]$/.test(key))){
                e.preventDefault();
                cmdline.value = '';
                handleMenuKey(key);
                return;
            }
        }
		if (e.key==='ArrowUp'){
			e.preventDefault(); if (historyIdx>0) historyIdx--; cmdline.value = history[historyIdx]||cmdline.value; setTimeout(()=>cmdline.setSelectionRange(cmdline.value.length, cmdline.value.length)); return;
		}
		if (e.key==='ArrowDown'){
			e.preventDefault(); if (historyIdx<history.length) historyIdx++; cmdline.value = history[historyIdx]||''; setTimeout(()=>cmdline.setSelectionRange(cmdline.value.length, cmdline.value.length)); return;
		}
	});

	(function boot(){
		loadProfilesStructure();
		renderMainMenu();
		updateStatusBar();
		showPrompt();
		cmdline.focus();
	})();

	// Auto update status bar on storage-changing commands
	const _save = saveStateAndMeta;
	saveStateAndMeta = function(pid, state, meta){ _save(pid, state, meta); updateStatusBar(); };

})();


