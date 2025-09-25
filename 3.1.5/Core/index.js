'use strict';

const fs = require('fs');
const path = require('path');
const { clampRange, parseExclude } = require('./lib/utils');
const Roster = require('./lib/roster');
const { sampleInt } = require('./lib/picker');
const State = require('./lib/state');
const { getState, saveState, getMeta, saveMeta, getProfiles, saveProfiles, DATA_DIR, ensureDir } = require('./lib/storage');

ensureDir(DATA_DIR);

function print(s) { process.stdout.write(String(s) + '\n'); }
function readStdinSync() { try { return fs.readFileSync(0, 'utf8'); } catch (_) { return ''; } }

function usage() {
	print(`用法: node Core/index.js <命令> [...参数]

常用命令：
  help                              显示帮助
  profile list                      列出班级
  profile new <名称>                新建班级（复制当前设置）
  profile use <id>                  切换当前班级
  profile rename <id> <新名称>      重命名
  profile delete <id>               删除（至少保留一个）
  profile export <文件>             导出当前班级配置到文件
  profile import <文件>             从文件导入为新班级

  state show                        显示当前设置
  state set [min N] [max N] [exclude 列表] [noRepeat true|false]
  expire show|set <session|40m|1d>  查看/设置不重复过期策略
  picked clear                      清空不重复与历史

  roster show                       显示自定义名单
  roster set --file <路径>          从文件设置名单
  roster set --text <文本|使用管道>  从文本设置名单
  roster tool <format|sort-id|sort-name|dedupe|trim>

  weights enable <true|false>       开关概率权重
  weights mask <true|false>         掩盖概率（仅语义保留）
  weights ignoreNR <true|false>     权重学号忽略不重复
  weights list                      列出权重
  weights add <学号> <百分比>
  weights add-group "1,2,5-10"      批量添加学号（百分比默认0）
  weights clear                     清空权重
  weights total                     计算当前范围内已分配百分比

  roll [--count N]                  随机抽取N次（默认1次），更新历史/不重复
  history show|undo|clear           查看/撤销最后一次/清空历史

提示：可用 Windows 下的 core.cmd 简化调用。
`);
}

function current() {
	const profileId = State.getCurrentProfileId();
	const { state, meta } = State.loadStateAndMeta(profileId);
	return { profileId, state, meta };
}

function save(profileId, state, meta) {
	State.saveStateAndMeta(profileId, state, meta);
}

function parseArgs(argv) {
	const args = argv.slice(2);
	const cmd = args.shift() || 'help';
	return { cmd, args };
}

function ensureStateFields(state) {
	if (!Array.isArray(state.weightRules)) state.weightRules = [];
	if (!Array.isArray(state.picked)) state.picked = [];
	if (!Array.isArray(state.history)) state.history = [];
}

function cmdProfile(args) {
	const sub = args[0];
	if (!sub || sub === 'list') {
		const list = State.listProfiles();
		const cur = State.getCurrentProfileId();
		list.forEach(p => print((p.id === cur ? '* ' : '  ') + p.id + '\t' + p.name));
		return;
	}
	if (sub === 'new') {
		const name = args.slice(1).join(' ') || '新建班级';
		const p = State.createProfile(name, true);
		print('已创建：' + p.id + ' ' + p.name);
		return;
	}
	if (sub === 'use') {
		const id = args[1];
		if (!id) throw new Error('缺少 id');
		State.setCurrentProfile(id);
		print('已切换到：' + id);
		return;
	}
	if (sub === 'rename') {
		const id = args[1];
		const name = args.slice(2).join(' ');
		if (!id || !name) throw new Error('用法：profile rename <id> <新名称>');
		State.renameProfile(id, name);
		print('已重命名：' + id + ' -> ' + name);
		return;
	}
	if (sub === 'delete') {
		const id = args[1];
		if (!id) throw new Error('缺少 id');
		const cur = State.deleteProfile(id);
		print('已删除。当前班级：' + cur);
		return;
	}
	if (sub === 'export') {
		const file = args[1];
		if (!file) throw new Error('缺少导出文件路径');
		const pid = State.getCurrentProfileId();
		const list = State.listProfiles();
		const profile = list.find(p => p.id === pid);
		const name = profile ? profile.name : '未命名班级';
		const state = getState(pid) || {};
		const meta = getMeta(pid) || {};
		const payload = { type: 'rollcall-profile', version: 1, name, state, meta };
		fs.writeFileSync(path.resolve(file), JSON.stringify(payload, null, 2), 'utf8');
		print('已导出到 ' + path.resolve(file));
		return;
	}
	if (sub === 'import') {
		const file = args[1];
		if (!file) throw new Error('缺少导入文件路径');
		const raw = fs.readFileSync(path.resolve(file), 'utf8');
		const obj = JSON.parse(raw);
		const name = String(obj && obj.name) || path.basename(file).replace(/\.json$/i, '') || '导入班级';
		const state = obj && obj.state ? obj.state : obj;
		if (!state || typeof state !== 'object') throw new Error('导入文件格式不正确');
		if (!Array.isArray(state.weightRules)) state.weightRules = [];
		if (!Array.isArray(state.picked)) state.picked = [];
		if (!Array.isArray(state.history)) state.history = [];
		const p = State.createProfile(name, false);
		saveState(p.id, state);
		if (obj && obj.meta) saveMeta(p.id, obj.meta);
		print('导入成功：' + p.id + ' ' + name);
		return;
	}
	throw new Error('未知子命令: profile ' + sub);
}

function cmdState(args) {
	const sub = args[0] || 'show';
	const { profileId, state, meta } = current();
	ensureStateFields(state);
	if (sub === 'show') {
		print(JSON.stringify({ profileId, state, meta }, null, 2));
		return;
	}
	if (sub === 'set') {
		let i = 1;
		while (i < args.length) {
			const key = args[i++];
			const val = args[i];
			if (val === undefined) break;
			i++;
			if (key === 'min') state.min = Number(val);
			else if (key === 'max') state.max = Number(val);
			else if (key === 'exclude') state.exclude = String(val);
			else if (key === 'noRepeat') state.noRepeat = /^(1|true|yes)$/i.test(String(val));
			else if (key === 'weightsEnabled') state.weightsEnabled = /^(1|true|yes)$/i.test(String(val));
			else throw new Error('不支持的键：' + key);
		}
		State.saveStateAndMeta(profileId, state, meta);
		print('已更新');
		return;
	}
	throw new Error('未知子命令: state ' + sub);
}

function cmdExpire(args) {
	const sub = args[0] || 'show';
	const { profileId, state, meta } = current();
	if (sub === 'show') { print(meta.noRepeatExpire || 'session'); return; }
	if (sub === 'set') {
		const mode = args[1];
		if (!/^(session|40m|1d)$/.test(String(mode))) throw new Error('值必须为 session|40m|1d');
		meta.noRepeatExpire = mode;
		meta.pickedSavedAt = Date.now();
		State.saveStateAndMeta(profileId, state, meta);
		print('已设置过期策略为 ' + mode);
		return;
	}
	throw new Error('未知子命令: expire ' + sub);
}

function cmdPicked(args) {
	const sub = args[0];
	if (sub === 'clear') {
		const { profileId, state, meta } = current();
		state.picked = [];
		state.history = [];
		meta.pickedSavedAt = Date.now();
		State.saveStateAndMeta(profileId, state, meta);
		print('已清空');
		return;
	}
	throw new Error('未知子命令: picked ' + sub);
}

function cmdRoster(args) {
	const sub = args[0] || 'show';
	const { profileId, state, meta } = current();
	if (sub === 'show') { print(state.roster || ''); return; }
	if (sub === 'set') {
		const mode = args[1];
		if (mode === '--file') {
			const file = args[2];
			if (!file) throw new Error('缺少 --file 路径');
			state.roster = fs.readFileSync(path.resolve(file), 'utf8');
		} else if (mode === '--text') {
			const text = args.slice(2).join(' ');
			state.roster = text || readStdinSync();
		} else {
			throw new Error('用法：roster set --file <路径> | --text <文本 | 通过管道>');
		}
		State.saveStateAndMeta(profileId, state, meta);
		print('已更新名单');
		return;
	}
	if (sub === 'tool') {
		const action = args[1];
		const raw = state.roster || '';
		let out = raw;
		if (action === 'format') out = Roster.normalizeRoster(raw);
		else if (action === 'sort-id') out = Roster.sortRosterById(raw);
		else if (action === 'sort-name') out = Roster.sortRosterByName(raw);
		else if (action === 'dedupe') out = Roster.dedupeRosterById(raw);
		else if (action === 'trim') out = Roster.trimRosterEmptyLines(raw);
		else throw new Error('未知工具：' + action);
		state.roster = out;
		State.saveStateAndMeta(profileId, state, meta);
		print('已应用：' + action);
		return;
	}
	throw new Error('未知子命令: roster ' + sub);
}

function cmdWeights(args) {
	const sub = args[0] || 'list';
	const { profileId, state, meta } = current();
	state.weightRules = Array.isArray(state.weightRules) ? state.weightRules : [];
	const map = new Map(state.weightRules.map(x => [Number(x.id), Number(x.percent)]));
	if (sub === 'enable') {
		state.weightsEnabled = /^(1|true|yes)$/i.test(String(args[1]));
		State.saveStateAndMeta(profileId, state, meta);
		print('weightsEnabled=' + state.weightsEnabled);
		return;
	}
	if (sub === 'mask') {
		state.weightsMaskEnabled = /^(1|true|yes)$/i.test(String(args[1]));
		State.saveStateAndMeta(profileId, state, meta);
		print('weightsMaskEnabled=' + state.weightsMaskEnabled);
		return;
	}
	if (sub === 'ignoreNR') {
		state.weightsIgnoreNoRepeat = /^(1|true|yes)$/i.test(String(args[1]));
		State.saveStateAndMeta(profileId, state, meta);
		print('weightsIgnoreNoRepeat=' + state.weightsIgnoreNoRepeat);
		return;
	}
	if (sub === 'list') {
		const arr = Array.from(map.entries()).sort((a,b)=>a[0]-b[0]).map(([id, p]) => ({ id, percent: p }));
		print(JSON.stringify(arr, null, 2));
		return;
	}
	if (sub === 'add') {
		const id = Math.floor(Number(args[1]));
		const percent = Math.max(0, Math.floor(Number(args[2])) || 0);
		if (!Number.isFinite(id)) throw new Error('学号需为整数');
		map.set(id, percent);
		state.weightRules = Array.from(map.entries()).map(([id, percent]) => ({ id, percent }));
		State.saveStateAndMeta(profileId, state, meta);
		print('已设置：' + id + ' -> ' + percent + '%');
		return;
	}
	if (sub === 'add-group') {
		const text = args[1];
		if (!text) throw new Error('缺少学号组');
		const ids = new Set();
		let hasInvalid = false;
		String(text).split(/[,，\s]+/).filter(Boolean).forEach(tok => {
			if (!/^\-?\d+(\s*-\s*\-?\d+)?$/.test(tok)) { hasInvalid = true; return; }
			const m = tok.match(/^(\-?\d+)\s*-\s*(\-?\d+)$/);
			if (m) {
				let a = Math.floor(Number(m[1]));
				let b = Math.floor(Number(m[2]));
				if (Number.isFinite(a) && Number.isFinite(b)) { if (a > b) [a, b] = [b, a]; for (let i=a;i<=b;i++) ids.add(i); }
				else { hasInvalid = true; }
			} else {
				const n = Math.floor(Number(tok));
				if (Number.isFinite(n)) ids.add(n); else hasInvalid = true;
			}
		});
		if (hasInvalid || ids.size === 0) throw new Error('存在非法输入，示例：1,2,5-10');
		ids.forEach(n => { if (!map.has(n)) map.set(n, 0); });
		state.weightRules = Array.from(map.entries()).map(([id, percent]) => ({ id, percent }));
		State.saveStateAndMeta(profileId, state, meta);
		print('已添加 ' + ids.size + ' 个学号');
		return;
	}
	if (sub === 'clear') {
		state.weightRules = [];
		State.saveStateAndMeta(profileId, state, meta);
		print('已清空权重');
		return;
	}
	if (sub === 'total') {
		const [min, max] = clampRange(state.min, state.max);
		const excludeSet = parseExclude(state.exclude);
		const pickedSet = new Set(state.picked || []);
		let total = 0;
		for (const [id, p] of map.entries()) {
			const ignoreNR = !!(state.noRepeat && state.weightsIgnoreNoRepeat);
			if (id >= min && id <= max && !excludeSet.has(id) && (!state.noRepeat || ignoreNR || !pickedSet.has(id))) {
				total += Math.max(0, Number(p) || 0);
			}
		}
		print(total + '%');
		return;
	}
	throw new Error('未知子命令: weights ' + sub);
}

function cmdRoll(args) {
	const { profileId, state, meta } = current();
	ensureStateFields(state);
	const [min, max] = clampRange(state.min, state.max);
	const excludeSet = parseExclude(state.exclude);
	const pickedSet = new Set(state.picked || []);
	const weightMap = new Map((state.weightRules || []).map(x => [Number(x.id), Number(x.percent)]));
	const countIdx = args.indexOf('--count');
	let count = 1;
	if (countIdx >= 0 && args[countIdx+1]) count = Math.max(1, Math.floor(Number(args[countIdx+1])) || 1);
	for (let k = 0; k < count; k++) {
		const n = sampleInt(min, max, excludeSet, !!state.noRepeat, pickedSet, weightMap, {
			weightsEnabled: !!state.weightsEnabled,
			weightsMaskEnabled: !!state.weightsMaskEnabled,
			weightsIgnoreNoRepeat: !!state.weightsIgnoreNoRepeat,
			isRolling: false,
		});
		if (n == null) { print('无可选学号'); break; }
		const name = Roster.parseRoster(state.roster).get(n) || '';
		print((name ? `${n}\t${name}` : String(n)));
		if (state.noRepeat) pickedSet.add(n);
		state.history.push({ number: n, name, time: new Date().toLocaleString() });
	}
	state.picked = Array.from(pickedSet);
	meta.pickedSavedAt = Date.now();
	State.saveStateAndMeta(profileId, state, meta);
}

function cmdHistory(args) {
	const sub = args[0] || 'show';
	const { profileId, state, meta } = current();
	ensureStateFields(state);
	if (sub === 'show') {
		print(JSON.stringify(state.history, null, 2));
		return;
	}
	if (sub === 'undo') {
		const last = state.history.pop();
		if (last) {
			const idx = state.picked.indexOf(last.number);
			if (idx >= 0) state.picked.splice(idx, 1);
			State.saveStateAndMeta(profileId, state, meta);
			print('已撤销：' + last.number + (last.name ? ' ' + last.name : ''));
		} else {
			print('无历史');
		}
		return;
	}
	if (sub === 'clear') {
		state.history = [];
		State.saveStateAndMeta(profileId, state, meta);
		print('已清空历史');
		return;
	}
	throw new Error('未知子命令: history ' + sub);
}

function main() {
	const { cmd, args } = parseArgs(process.argv);
	try {
		switch (cmd) {
			case 'help': usage(); break;
			case 'profile': cmdProfile(args); break;
			case 'state': cmdState(args); break;
			case 'expire': cmdExpire(args); break;
			case 'picked': cmdPicked(args); break;
			case 'roster': cmdRoster(args); break;
			case 'weights': cmdWeights(args); break;
			case 'roll': cmdRoll(args); break;
			case 'history': cmdHistory(args); break;
			default:
				usage();
		}
	} catch (e) {
		print('错误：' + (e && e.message ? e.message : String(e)));
		process.exitCode = 1;
	}
}

if (require.main === module) main();


