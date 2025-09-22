/* 学号随机点名系统 - 绿色主题 */
(function () {
	'use strict';

	/** DOM 缓存 **/
	const inputMin = document.getElementById('inputMin');
	const inputMax = document.getElementById('inputMax');
	const inputExclude = document.getElementById('inputExclude');
	// 第二组按钮（底部）
	const startButtons = Array.from(document.querySelectorAll('.js-start'));
	const stopButtons = Array.from(document.querySelectorAll('.js-stop'));
	const displayNumber = document.getElementById('displayNumber');
	const displayName = document.getElementById('displayName');
	const displayCountdown = document.getElementById('displayCountdown');
	const displayLabel = document.getElementById('displayLabel');
	const displayBox = document.querySelector('.display');
    // 结果操作栏
    const resultActions = document.getElementById('resultActions');
    const btnMarkCorrect = document.getElementById('btnMarkCorrect');
    const btnMarkWrong = document.getElementById('btnMarkWrong');
    const btnMarkSkip = document.getElementById('btnMarkSkip');
	const btnOpenSettings = document.getElementById('btnOpenSettings');
	const settingsSheet = document.getElementById('settingsSheet');
	const btnSettingsCancel = document.getElementById('btnSettingsCancel');
	const btnSettingsSave = document.getElementById('btnSettingsSave');
	const btnSettingsClose = document.getElementById('btnSettingsClose');
	const settingsSearchInput = document.getElementById('settingsSearchInput');
	const settingsSearchClear = document.getElementById('settingsSearchClear');
	const settingsSearchEmpty = document.getElementById('settingsSearchEmpty');
	const settingsSearchBar = document.getElementById('settingsSearchBar');
	const settingsSearchLabel = document.getElementById('settingsSearchLabel');
	const settingsSearchCancel = document.getElementById('settingsSearchCancel');
	const btnClearPicked = document.getElementById('btnClearPicked');
	const switchNoRepeat = document.getElementById('switchNoRepeat');
	const switchAnimate = document.getElementById('switchAnimate');
	const textareaRoster = document.getElementById('textareaRoster');
	const btnToggleTheme = document.getElementById('btnToggleTheme');
	const btnAuto5s = document.getElementById('btnAuto5s');
	// 简化：新功能弹窗与顶部横幅移至独立模块
	// 新增设置控件
	const switchShowRangeBar = document.getElementById('switchShowRangeBar');
	const rangeBar = document.getElementById('rangeBar');
	const inputAutoSeconds = document.getElementById('inputAutoSeconds');
	const autoSecondsPreview = document.getElementById('autoSecondsPreview');
	const selectNoRepeatExpire = document.getElementById('selectNoRepeatExpire');
	// 概率权重设置相关（按学号）
	const switchEnableWeights = document.getElementById('switchEnableWeights');
	const switchWeightsMask = document.getElementById('switchWeightsMask');
	const btnOpenWeights = document.getElementById('btnOpenWeights');
	const weightsSheet = document.getElementById('weightsSheet');
	const btnWeightsClose = document.getElementById('btnWeightsClose');
	const btnWeightsCancel = document.getElementById('btnWeightsCancel');
	const btnWeightsSave = document.getElementById('btnWeightsSave');
	const btnWeightsAddId = document.getElementById('btnWeightsAddId');
	const btnWeightsClear = document.getElementById('btnWeightsClear');
	const btnWeightsAddGroup = document.getElementById('btnWeightsAddGroup');
	const weightsList = document.getElementById('weightsList');
	const weightsTotal = document.getElementById('weightsTotal');
	const switchWeightsIgnoreNoRepeat = document.getElementById('switchWeightsIgnoreNoRepeat');
	// 智能抽取（独立弹窗）
	const advancedSheet = document.getElementById('advancedSheet');
	const btnOpenAdvanced = document.getElementById('btnOpenAdvanced');
const btnAdvancedClose = document.getElementById('btnAdvancedClose');
const btnAdvancedCancel = document.getElementById('btnAdvancedCancel');
const btnAdvancedSave = document.getElementById('btnAdvancedSave');
const switchBalancedMode = document.getElementById('switchBalancedMode');
const inputBalancedBoost = document.getElementById('inputBalancedBoost');
const balancedBoostPreview = document.getElementById('balancedBoostPreview');
	// 智慧统计控制
    const switchSmartStats = document.getElementById('switchSmartStats');
    const switchSmartStatsDecay = document.getElementById('switchSmartStatsDecay');
    const inputSmartWrongAlpha = document.getElementById('inputSmartWrongAlpha');
    const smartWrongAlphaPreview = document.getElementById('smartWrongAlphaPreview');
    const btnOpenSmartStats = document.getElementById('btnOpenSmartStats');
    const smartStatsSheet = document.getElementById('smartStatsSheet');
    const btnSmartStatsClose = document.getElementById('btnSmartStatsClose');
    const btnSmartStatsOk = document.getElementById('btnSmartStatsOk');
    const smartStatsMonthTitle = document.getElementById('smartStatsMonthTitle');
    const smartStatsTopPicked = document.getElementById('smartStatsTopPicked');
    const smartStatsTopCorrect = document.getElementById('smartStatsTopCorrect');
    const smartStatsTopWrong = document.getElementById('smartStatsTopWrong');
    // 智慧统计提示（需关闭不重复）
    const hintDisableNoRepeat = document.getElementById('hintDisableNoRepeat');
    const actionDisableNoRepeat = document.getElementById('actionDisableNoRepeat');
    // 标题下方的同款提示（与下文复用一套逻辑，通过 class 统一）
    const hintDisableNoRepeatTop = document.getElementById('hintDisableNoRepeatTop');
    const hintDisableNoRepeatTopRow = document.getElementById('hintDisableNoRepeatTopRow');
    const actionDisableNoRepeatTop = document.getElementById('actionDisableNoRepeatTop');
	// 智能抽取记录元素
	const balancedLogList = document.getElementById('balancedLogList');
	const balancedLogEmpty = document.getElementById('balancedLogEmpty');
	const btnBalancedLogClear = document.getElementById('btnBalancedLogClear');
	// 名单独立弹窗
	const rosterSheet = document.getElementById('rosterSheet');
	const btnOpenRoster = document.getElementById('btnOpenRoster');
	const btnRosterClose = document.getElementById('btnRosterClose');
	const btnRosterCancel = document.getElementById('btnRosterCancel');
	const btnRosterSave = document.getElementById('btnRosterSave');
	const btnRosterClear = document.getElementById('btnRosterClear');
	// 名单工具（新增）
	const rosterStats = document.getElementById('rosterStats');
	const btnRosterFormat = document.getElementById('btnRosterFormat');
	const btnRosterSortId = document.getElementById('btnRosterSortId');
	const btnRosterSortName = document.getElementById('btnRosterSortName');
	const btnRosterDedup = document.getElementById('btnRosterDedup');
	const btnRosterTrim = document.getElementById('btnRosterTrim');
	const btnRosterCopy = document.getElementById('btnRosterCopy');
	const btnRosterPaste = document.getElementById('btnRosterPaste');
	// 班级配置相关
	const profileSelect = document.getElementById('profileSelect');
	const profileSelectSettings = document.getElementById('profileSelectSettings');
	const btnProfileNew = document.getElementById('btnProfileNew');
	const btnProfileRename = document.getElementById('btnProfileRename');
	const btnProfileDelete = document.getElementById('btnProfileDelete');
	const btnProfileExport = document.getElementById('btnProfileExport');
	const btnProfileImport = document.getElementById('btnProfileImport');
	const inputImportProfile = document.getElementById('inputImportProfile');
  // 主题色设置
  const btnOpenTheme = document.getElementById('btnOpenTheme');
  const themeSheet = document.getElementById('themeSheet');
  const btnThemeClose = document.getElementById('btnThemeClose');
  const btnThemeCancel = document.getElementById('btnThemeCancel');
  const btnThemeSave = document.getElementById('btnThemeSave');
  const btnThemeReset = document.getElementById('btnThemeReset');
  const btnThemeSaveCustom = document.getElementById('btnThemeSaveCustom');
  const inputThemeColor = document.getElementById('inputThemeColor');
  const themeSwatches = document.getElementById('themeSwatches');
  const themeCustomColors = document.getElementById('themeCustomColors');

	/** 状态 **/
	const STORAGE_KEY = 'rollcall:v1';
	const STORAGE_META_KEY = 'rollcall:v1:meta';
	const PROFILES_KEY = 'rollcall:v1:profiles';
	let currentProfileId = '';
	let profilesList = []; // [{id, name}]
	let timerId = null;
	let isRolling = false;
	let pickedStack = []; // 历史栈（用于撤销）
	let pickedSet = new Set(); // 已抽到（用于不重复）
	let rosterMap = new Map(); // 学号 -> 姓名
	let autoSeconds = 5; // 自动抽人时长（秒）
	let noRepeatExpire = 'session'; // session | 40m | 1d
	let prevLabelText = '当前学号';
	let countdownActive = false;
	let countdownRAF = 0;
	let fixedDisplayHeight = 0; // 固定显示框高度（像素）
	// 概率权重：Map<number, number>  学号 -> 百分比
	let weightMap = new Map();
	let weightsEnabled = false;
	let weightsIgnoreNoRepeat = false; // 已设置权重的学号可忽略"不重复"
	let weightsMaskEnabled = false; // 掩盖概率：滚动时不按权重，结果按权重
	// 均衡与种子随机
	let balancedEnabled = false;
	let lastPickedAtMap = new Map(); // 学号 -> 最近一次被抽时间戳
	// 智能抽取记录
	let balancedLogs = []; // [{number, time}]
	let lastPickWasBalanced = false; // 仅对最终点名有效
let balancedBoostMax = 2.0; // [1,3]
    // 智慧统计：{ monthKey: { [id]: {picked, correct, wrong} } }
    let smartStatsEnabled = false;
    let smartStats = {};
    let smartStatsDecayEnabled = true; // 仅在答对后才降低概率
    const getMonthKey = (ts = Date.now()) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    };
    // 智慧统计提升强度系数（错得越多被抽概率上升更多）
    let SMART_WRONG_ALPHA = 2.0;
    let SMART_CORRECT_DECAY = 0.6; // 0~1

    // 均衡记录：最简渲染与追加（UI 可选）
    const renderBalancedLogs = () => {
        if (!balancedLogList) return; // 当前版本可无 UI
        balancedLogList.innerHTML = '';
        if (!Array.isArray(balancedLogs) || balancedLogs.length === 0) {
            balancedLogEmpty && balancedLogEmpty.classList.remove('hidden');
            return;
        }
        balancedLogEmpty && balancedLogEmpty.classList.add('hidden');
        // 简单渲染（最多最近20条）
        const recent = balancedLogs.slice(-20).reverse();
        recent.forEach(rec => {
            const row = document.createElement('div');
            row.className = 'weui-cell';
            row.innerHTML = `<div class="weui-cell__bd">学号 ${rec.number}</div><div class="weui-cell__ft">${new Date(rec.time).toLocaleString()}</div>`;
            balancedLogList.appendChild(row);
        });
    };

    const appendBalancedLog = (number, time) => {
        try {
            balancedLogs.push({ number, time });
            const key = getMetaKey(currentProfileId) + ':balancedLogs';
            localStorage.setItem(key, JSON.stringify(balancedLogs));
            renderBalancedLogs();
        } catch (_) { /* ignore */ }
    };

	/** 自适应字号：根据容器可用空间自适应显示学号 **/
	const isCountdownVisible = () => !!displayCountdown && !displayCountdown.classList.contains('hidden');
	const fitDisplayNumber = () => {
		if (!displayNumber || !displayBox) return;
		if (displayNumber.classList.contains('is-placeholder')) return; // 占位提示时无需计算宽度
		if (isCountdownVisible()) return;
		const ensureStableNumberWidth = () => {
			const clampSafe = clampRange(Number(inputMin?.value), Number(inputMax?.value));
			const a = Math.abs(clampSafe[0]);
			const b = Math.abs(clampSafe[1]);
			const absMax = Math.max(a, b, 0);
			const digits = String(Math.floor(absMax || 0)).length || 1;
			const hasNegative = (Number(inputMin?.value) || 0) < 0;
			// 采用更宽的数字"8"进行测量，获得上限宽度
			const sample = (hasNegative ? '-' : '') + '8'.repeat(Math.max(1, digits));
			const meas = document.createElement('span');
			meas.className = displayNumber.className;
			meas.style.position = 'absolute';
			meas.style.visibility = 'hidden';
			meas.style.whiteSpace = 'nowrap';
			meas.style.left = '-99999px';
			meas.textContent = sample;
			document.body.appendChild(meas);
			const widthPx = Math.ceil(meas.getBoundingClientRect().width);
			meas.remove();
			displayNumber.style.setProperty('--number-min-width', widthPx + 'px');
			displayNumber.style.minWidth = widthPx + 'px';
			displayNumber.style.width = widthPx + 'px'; // 固定宽度，确保完全不位移
		};
		ensureStableNumberWidth();
	};

	/** 在滚动过程中锁定显示容器高度，避免小屏布局抖动 */
	const lockDisplayBoxHeight = () => {
		if (!displayBox) return;
		if (fixedDisplayHeight > 0) {
			displayBox.style.minHeight = fixedDisplayHeight + 'px';
		}
	};

	const setFixedDisplayHeight = () => {
		if (!displayBox) return;
		const rect = displayBox.getBoundingClientRect();
		fixedDisplayHeight = Math.max(0, Math.ceil(rect.height));
		lockDisplayBoxHeight();
	};

	const unlockDisplayBoxHeight = () => {
		if (!displayBox) return;
		displayBox.style.minHeight = '';
		fixedDisplayHeight = 0;
	};

	/** 动态 vh 兼容：把真实可视高度（除去地址栏/系统条）写入 CSS 变量 --vh */
	const setDynamicVhVar = () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', vh + 'px');
	};

	/**
	 * 依据视口高度动态限制显示区高度，确保页面在任意设备上完整可见
	 * 计算方式：可视高度 - 显示区到视口顶部的距离 - 下方控件/页脚高度 - 安全间距
	 * 注意：滚动进行中不调整，避免抖动
	 */
	const adjustDisplayBoxToViewport = () => {
		if (!displayBox) return;
		if (isRolling) return;
		setFixedDisplayHeight();
	};

	// 重新计算并锁定显示框高度（用于窗口变化后保持前后一致）
	const refreshAndLockDisplayBoxHeight = () => {
		unlockDisplayBoxHeight();
		setFixedDisplayHeight();
		fitDisplayNumber();
	};

	/** 班级配置：工具与持久化 **/
	const generateProfileId = () => 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
	const getStateKey = (pid) => `rollcall:v1:profile:${pid}`;
	const getMetaKey = (pid) => `rollcall:v1:profile:${pid}:meta`;

	const saveProfilesStructure = () => {
		const data = { list: profilesList, currentId: currentProfileId, version: 1 };
		try { localStorage.setItem(PROFILES_KEY, JSON.stringify(data)); } catch (_) {}
	};

	const loadProfilesStructure = () => {
		let data = null;
		try { const raw = localStorage.getItem(PROFILES_KEY); if (raw) data = JSON.parse(raw); } catch (_) {}
		if (!data || !Array.isArray(data.list)) data = { list: [], currentId: '' };
		// 迁移：旧版本仅有单一 STORAGE_KEY
		if (data.list.length === 0) {
			const id = 'default';
			data.list.push({ id, name: '默认班级' });
			data.currentId = id;
			try {
				const oldState = localStorage.getItem(STORAGE_KEY);
				if (oldState) localStorage.setItem(getStateKey(id), oldState);
				const oldMeta = localStorage.getItem(STORAGE_META_KEY);
				if (oldMeta) localStorage.setItem(getMetaKey(id), oldMeta);
			} catch (_) {}
			try { localStorage.setItem(PROFILES_KEY, JSON.stringify(data)); } catch (_) {}
		}
		profilesList = data.list;
		currentProfileId = data.currentId || (profilesList[0] && profilesList[0].id) || 'default';
		if (!profilesList.some(p => p.id === currentProfileId)) {
			currentProfileId = profilesList[0]?.id || 'default';
		}
	};

	const populateProfileSelects = () => {
		const optionsHtml = profilesList.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
		if (profileSelect) { profileSelect.innerHTML = optionsHtml; profileSelect.value = currentProfileId; }
		if (profileSelectSettings) { profileSelectSettings.innerHTML = optionsHtml; profileSelectSettings.value = currentProfileId; }
	};

	const setCurrentProfile = (pid) => {
		if (!profilesList.some(p => p.id === pid)) return;
		currentProfileId = pid;
		saveProfilesStructure();
		populateProfileSelects();
		// 加载该班级的状态到界面
		loadState();
		applyRoster();
		renderHistory();
		const last = pickedStack[pickedStack.length - 1];
		updateDisplay(last ? last.number : null);
		applyRangeBarVisible();
		updateAutoSecondsUI();
		// 同步权重 UI
		if (weightsEnabled && switchEnableWeights) switchEnableWeights.checked = true;
		// 加载并渲染该班级的智能抽取记录
		try {
			const raw = localStorage.getItem(getMetaKey(currentProfileId)+':balancedLogs');
			balancedLogs = raw ? JSON.parse(raw) : [];
			renderBalancedLogs();
		} catch (_) { balancedLogs = []; renderBalancedLogs(); }
	};

	/** 工具函数 **/
	const showTip = (msg) => {
		const hasWeuiTopTips = typeof window !== 'undefined' && window.weui && typeof window.weui.topTips === 'function';
		if (hasWeuiTopTips) window.weui.topTips(String(msg), 2000);
		else alert(String(msg));
	};
	const clampRange = window.Utils.clampRange;

	const parseExclude = window.Utils.parseExclude;

	const parseRoster = window.Roster.parseRoster;

	const sampleInt = (min, max, excludeSet, noRepeat, options = {}) => {
		const rand = Math.random;
		// 先判断当前范围是否存在正权重学号
		let hasPositiveWeightInRange = false;
		for (let i = min; i <= max; i++) {
			if (excludeSet.has(i)) continue;
			if ((Number(weightMap.get(i)) || 0) > 0) { hasPositiveWeightInRange = true; break; }
		}
		const ignoreNoRepeatActive = !!(noRepeat && weightsIgnoreNoRepeat && weightsEnabled && hasPositiveWeightInRange);

		const candidates = [];
		for (let i = min; i <= max; i++) {
			if (excludeSet.has(i)) continue;
			if (noRepeat && pickedSet.has(i)) {
				// 开启"权重学号忽略不重复"时，让有正权重的学号不受不重复限制
				const isWeightedPositive = (Number(weightMap.get(i)) || 0) > 0;
				if (!(ignoreNoRepeatActive && isWeightedPositive)) continue;
			}
			candidates.push(i);
		}
		if (candidates.length === 0) return null;
		// 加权条件：显式启用权重，或启用均衡模式（滚动时若开启掩盖则仍走均匀随机）
		let useWeighted = !!weightsEnabled || !!balancedEnabled;
		if (!useWeighted || (weightsMaskEnabled && isRolling)) {
			const idx = Math.floor(rand() * candidates.length);
			return candidates[idx];
		}
		// 构建每个候选学号的权重，未设置者取剩余平均
		const weights = new Array(candidates.length).fill(0);
		let assignedTotal = 0;
		let unsetCount = 0;
		for (let i = 0; i < candidates.length; i++) {
			const n = candidates[i];
			const p = weightsEnabled ? (Number(weightMap.get(n)) || 0) : 0;
			if (p > 0) {
				weights[i] = p;
				assignedTotal += p;
			} else {
				unsetCount++;
			}
		}
		if (assignedTotal < 100 && unsetCount > 0) {
			const remain = Math.max(0, 100 - assignedTotal);
			const avg = remain / unsetCount;
			for (let i = 0; i < candidates.length; i++) {
				if (weights[i] === 0) weights[i] = avg;
			}
		}
		// 均衡模式：对久未被抽到者提升 1x~N 权重（N 可配置，默认 2）
		if (balancedEnabled) {
			const now = Date.now();
			const ages = new Array(candidates.length);
			let minAge = Infinity;
			let maxAge = 0;
			let anyFinite = false;
			for (let i = 0; i < candidates.length; i++) {
				const id = candidates[i];
				const ts = Number(lastPickedAtMap.get(id)) || 0;
				let age;
				if (ts > 0 && ts < now) { age = Math.max(0, now - ts); anyFinite = true; } else { age = Infinity; }
				ages[i] = age;
				if (Number.isFinite(age)) { if (age < minAge) minAge = age; if (age > maxAge) maxAge = age; }
			}
			const baseMax = anyFinite ? Math.max(1, maxAge) : 1;
			const notPickedAge = baseMax * 1.5 + 1000;
			for (let i = 0; i < ages.length; i++) { if (!Number.isFinite(ages[i])) ages[i] = notPickedAge; }
			minAge = Math.min(minAge, notPickedAge);
			maxAge = Math.max(maxAge, notPickedAge);
			const span = Math.max(1, maxAge - minAge);
			const maxBoost = Math.min(3, Math.max(1, Number(balancedBoostMax) || 2));
			for (let i = 0; i < candidates.length; i++) {
				const normalized = (ages[i] - minAge) / span; // [0,1]
				const boost = 1 + normalized * (maxBoost - 1); // [1,maxBoost]
				weights[i] = Math.max(0, weights[i]) * boost;
			}
			// 标记：本次选择将可能因均衡加成
			lastPickWasBalanced = true;
		}

        // 智慧统计：对答错较多的学号提升权重（仅在启用时）
        if (smartStatsEnabled) {
            try {
                const mk = getMonthKey();
                const data = smartStats[mk] || {};
                // 错误率或错误次数影响：采用 (1 + wrong / (correct+1)) 的温和因子
                for (let i = 0; i < candidates.length; i++) {
                    const id = candidates[i];
                    const rec = data[id];
                    if (rec && (rec.wrong > 0 || rec.correct > 0)) {
                        const rawBoost = 1 + SMART_WRONG_ALPHA * (rec.wrong || 0) / (1 + (rec.correct || 0));
                        const boost = Math.min(3, Math.max(1, rawBoost));
                        weights[i] = Math.max(0, weights[i]) * boost;
                    }
                }
            } catch (_) {}
        }
		// 已分配总和可>100：允许按比例放大（同时保留未设权重者为0）
		let total = 0;
		for (let w of weights) total += Math.max(0, w);
		if (!(total > 0)) {
			// 如果权重总和为 0，则退化为等概率
			const idx = Math.floor(rand() * candidates.length);
			return candidates[idx];
		}
		// 加权随机
		let r = rand() * total;
		for (let i = 0; i < candidates.length; i++) {
			r -= Math.max(0, weights[i]);
			if (r <= 0) return candidates[i];
		}
		return candidates[candidates.length - 1];
	};

	// —— Seeded RNG: xmur3 + sfc32 ——
	// 已移除：种子随机实现

	// 历史 UI 已去除，仅保留数据结构即可
	const renderHistory = () => {};

	const updateDisplay = (n) => {
		// 为减少测量抖动，姓名先隐藏（CSS 仍保留空间）
		displayName?.classList.add('hidden');
		if (n != null) {
			displayNumber.textContent = String(n);
			displayNumber.classList.remove('is-placeholder');
		} else {
			displayNumber.textContent = '填写必要设置后开始！';
			displayNumber.classList.add('is-placeholder');
		}
		const name = n != null ? rosterMap.get(n) : '';
		if (name) {
			displayName.textContent = name;
			// 不在滚动时再显示，滚动中由 CSS 隐藏
			if (!isRolling) displayName.classList.remove('hidden');
		} else {
			displayName.textContent = '—';
			displayName.classList.add('hidden');
		}
		// 滚动中不触发自适应，避免频繁重排；停止时会调用。
		if (!isRolling) requestAnimationFrame(fitDisplayNumber);
	};

	const saveState = () => {
		const state = {
			min: Number(inputMin.value),
			max: Number(inputMax.value),
			exclude: inputExclude.value,
			noRepeat: switchNoRepeat.checked,
			animate: switchAnimate.checked,
			roster: textareaRoster.value,
			picked: noRepeatExpire === 'session' ? [] : Array.from(pickedSet),
			history: pickedStack,
			themeDark: document.documentElement.classList.contains('theme-dark'),
      // 记录当前主题色（十六进制）
      themeColor: (function(){
        try {
          const c = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
          const hex = toHexColor(c);
          return hex || (localStorage.getItem('rollcall:themeColor') || '');
        } catch (_) { return localStorage.getItem('rollcall:themeColor') || ''; }
      })(),
			showRangeBar: switchShowRangeBar ? switchShowRangeBar.checked : true,
			autoSeconds: inputAutoSeconds ? Number(inputAutoSeconds.value) : autoSeconds,
			weightsEnabled: switchEnableWeights ? !!switchEnableWeights.checked : weightsEnabled,
			weightsMaskEnabled: switchWeightsMask ? !!switchWeightsMask.checked : weightsMaskEnabled,
			weightsIgnoreNoRepeat: switchWeightsIgnoreNoRepeat ? !!switchWeightsIgnoreNoRepeat.checked : weightsIgnoreNoRepeat,
			weightRules: Array.from(weightMap.entries()).map(([id, percent]) => ({ id, percent })),
			// 均衡配置与数据
			balancedEnabled: switchBalancedMode ? !!switchBalancedMode.checked : balancedEnabled,
			lastPicked: Array.from(lastPickedAtMap.entries()).map(([id, ts]) => ({ id, ts })),
			balancedBoostMax: (function(){
				const v = inputBalancedBoost ? Number(inputBalancedBoost.value) : balancedBoostMax;
				return Math.min(3, Math.max(1, Number(v) || 2));
			})(),
			smartStatsEnabled: !!smartStatsEnabled,
			smartStatsDecayEnabled: !!smartStatsDecayEnabled,
			smartWrongAlpha: Number.isFinite(SMART_WRONG_ALPHA) ? SMART_WRONG_ALPHA : 2,
			smartCorrectDecay: Number.isFinite(SMART_CORRECT_DECAY) ? SMART_CORRECT_DECAY : 0.6
		};
		if (currentProfileId) localStorage.setItem(getStateKey(currentProfileId), JSON.stringify(state));
		// 保存元信息：不重复过期策略与时间戳
		const meta = {
			noRepeatExpire,
			pickedSavedAt: Date.now(),
		};
		if (currentProfileId) localStorage.setItem(getMetaKey(currentProfileId), JSON.stringify(meta));
        // 保存智慧统计数据（按月）
        try {
            const key = getMetaKey(currentProfileId)+':smartStats';
            localStorage.setItem(key, JSON.stringify(smartStats));
        } catch (_) {}
	};

	const loadState = () => {
		try {
			let raw = null;
			if (currentProfileId) raw = localStorage.getItem(getStateKey(currentProfileId));
			// 兼容老版本：若当前班级无数据且存在旧键
			if (!raw) raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const s = JSON.parse(raw);
			if (Number.isFinite(s.min)) inputMin.value = s.min;
			if (Number.isFinite(s.max)) inputMax.value = s.max;
			if (typeof s.exclude === 'string') inputExclude.value = s.exclude;
			switchNoRepeat.checked = !!s.noRepeat;
			switchAnimate.checked = s.animate !== false;
			if (typeof s.roster === 'string') textareaRoster.value = s.roster;
			// session 模式不加载历史 picked
			pickedSet = new Set(Array.isArray(s.picked) && s.picked.length && (!selectNoRepeatExpire || selectNoRepeatExpire.value !== 'session') ? s.picked : []);
			pickedStack = Array.isArray(s.history) ? s.history : [];
			if (s.themeDark) {
				document.documentElement.classList.add('theme-dark');
				document.body?.setAttribute('data-weui-theme', 'dark');
			} else {
				document.body?.setAttribute('data-weui-theme', 'light');
			}
      // 应用主题色（优先使用配置文件中的主题色）
      try {
        if (s.themeColor) {
          applyThemeColor(s.themeColor);
        } else {
          const savedTheme = localStorage.getItem('rollcall:themeColor');
          if (savedTheme) applyThemeColor(savedTheme);
        }
      } catch (_) {}

			// 新增设置：顶部范围栏显示与自动秒数
			if (switchShowRangeBar && typeof s.showRangeBar === 'boolean') {
				switchShowRangeBar.checked = s.showRangeBar;
			}
			if (typeof s.autoSeconds === 'number' && s.autoSeconds >= 1 && s.autoSeconds <= 10) {
				autoSeconds = Math.floor(s.autoSeconds);
				if (inputAutoSeconds) inputAutoSeconds.value = String(autoSeconds);
			}
			// 概率权重（按学号）
			weightsEnabled = !!s.weightsEnabled;
			if (switchEnableWeights) switchEnableWeights.checked = weightsEnabled;
			weightsMaskEnabled = !!s.weightsMaskEnabled;
			if (switchWeightsMask) switchWeightsMask.checked = weightsMaskEnabled;
			weightsIgnoreNoRepeat = !!s.weightsIgnoreNoRepeat;
			if (switchWeightsIgnoreNoRepeat) switchWeightsIgnoreNoRepeat.checked = weightsIgnoreNoRepeat;
			weightMap = new Map();
			if (Array.isArray(s.weightRules)) {
				for (const x of s.weightRules) {
					if (x && Number.isFinite(x.id) && Number.isFinite(x.percent)) {
						weightMap.set(Math.floor(x.id), Math.max(0, Math.floor(x.percent)));
					}
				}
			}
			// 均衡
			balancedEnabled = !!s.balancedEnabled;
			if (switchBalancedMode) switchBalancedMode.checked = balancedEnabled;
			balancedBoostMax = Math.min(3, Math.max(1, Number(s.balancedBoostMax) || 2));
			if (inputBalancedBoost) inputBalancedBoost.value = String(balancedBoostMax);
			if (balancedBoostPreview) balancedBoostPreview.textContent = `1.00x ~ ${balancedBoostMax.toFixed(2)}x`;
			lastPickedAtMap = new Map();
			// 智慧统计参数持久化
			smartStatsEnabled = !!s.smartStatsEnabled;
			if (switchSmartStats) switchSmartStats.checked = smartStatsEnabled;
			smartStatsDecayEnabled = !!s.smartStatsDecayEnabled;
			if (switchSmartStatsDecay) switchSmartStatsDecay.checked = smartStatsDecayEnabled;
			if (Number.isFinite(s.smartWrongAlpha)) {
				SMART_WRONG_ALPHA = Math.max(2, Math.min(5, Number(s.smartWrongAlpha)));
				if (inputSmartWrongAlpha) { inputSmartWrongAlpha.value = String(SMART_WRONG_ALPHA); inputSmartWrongAlpha.dispatchEvent(new Event('input')); }
			}
			if (Number.isFinite(s.smartCorrectDecay)) {
				SMART_CORRECT_DECAY = Math.max(0, Math.min(1, Number(s.smartCorrectDecay)));
				if (inputSmartCorrectDecay) { inputSmartCorrectDecay.value = String(SMART_CORRECT_DECAY); inputSmartCorrectDecay.dispatchEvent(new Event('input')); }
			}
			if (Array.isArray(s.lastPicked)) {
				for (const rec of s.lastPicked) {
					if (rec && Number.isFinite(rec.id) && Number.isFinite(rec.ts)) lastPickedAtMap.set(Math.floor(rec.id), Math.floor(rec.ts));
				}
			}
			// 智慧统计
			smartStatsEnabled = !!s.smartStatsEnabled;
			if (switchSmartStats) switchSmartStats.checked = smartStatsEnabled;
			try {
				const rawStats = localStorage.getItem(getMetaKey(currentProfileId)+':smartStats');
				smartStats = rawStats ? JSON.parse(rawStats) : {};
				if (typeof smartStats !== 'object' || !smartStats) smartStats = {};
			} catch (_) { smartStats = {}; }
			// 种子随机已移除

			// 加载过期策略并检查是否需要清空不重复集合
			try {
				let metaRaw = currentProfileId ? localStorage.getItem(getMetaKey(currentProfileId)) : null;
				if (!metaRaw) metaRaw = localStorage.getItem(STORAGE_META_KEY);
				if (metaRaw) {
					const meta = JSON.parse(metaRaw);
					if (meta && typeof meta.noRepeatExpire === 'string') {
						noRepeatExpire = meta.noRepeatExpire;
						if (selectNoRepeatExpire) selectNoRepeatExpire.value = noRepeatExpire;
					}
					const savedAt = Number(meta && meta.pickedSavedAt) || 0;
					if (savedAt > 0 && typeof meta.noRepeatExpire === 'string') {
						const now = Date.now();
						let ttlMs = 0;
						if (meta.noRepeatExpire === '40m') ttlMs = 40 * 60 * 1000;
						if (meta.noRepeatExpire === '1d') ttlMs = 24 * 60 * 60 * 1000;
						if (ttlMs > 0 && now - savedAt > ttlMs) {
							pickedSet.clear();
							pickedStack = [];
							// 保存一次，避免反复清空
							saveState();
						}
					}
				}
			} catch (_) {}
		} catch (e) {
			console.warn('load state failed', e);
		}
	};

	// 班级：CRUD 与导入导出
	const createProfile = (name, cloneFromCurrent = true) => {
		const id = generateProfileId();
		const profile = { id, name: String(name || '新建班级') };
		profilesList.push(profile);
		// 复制当前状态（不复制已抽与历史）或创建空白
		let base = null;
		if (cloneFromCurrent) {
			try {
				saveState(); // 确保最新
				const raw = currentProfileId ? localStorage.getItem(getStateKey(currentProfileId)) : null;
				if (raw) base = JSON.parse(raw);
			} catch (_) {}
		}
    if (!base) base = { min: 1, max: 50, exclude: '', noRepeat: true, animate: true, roster: '', picked: [], history: [], themeDark: document.documentElement.classList.contains('theme-dark'), themeColor: (function(){try {return toHexColor(getComputedStyle(document.documentElement).getPropertyValue('--brand')) || (localStorage.getItem('rollcall:themeColor')||'');} catch(_){return localStorage.getItem('rollcall:themeColor')||'';}})(), showRangeBar: true, autoSeconds: 5, weightsEnabled: false, weightRules: [] };
		base.picked = [];
		base.history = [];
		try { localStorage.setItem(getStateKey(id), JSON.stringify(base)); } catch (_) {}
		saveProfilesStructure();
		populateProfileSelects();
		setCurrentProfile(id);
	};

	const renameProfile = (pid, newName) => {
		const p = profilesList.find(x => x.id === pid);
		if (!p) return;
		p.name = String(newName || p.name);
		saveProfilesStructure();
		populateProfileSelects();
	};

	const deleteProfile = (pid) => {
		if (profilesList.length <= 1) { showTip('至少保留一个班级'); return; }
		const idx = profilesList.findIndex(x => x.id === pid);
		if (idx < 0) return;
		profilesList.splice(idx, 1);
		try { localStorage.removeItem(getStateKey(pid)); localStorage.removeItem(getMetaKey(pid)); } catch (_) {}
		if (currentProfileId === pid) {
			currentProfileId = profilesList[0].id;
		}
		saveProfilesStructure();
		populateProfileSelects();
		setCurrentProfile(currentProfileId);
	};

	const exportCurrentProfile = () => {
		try { saveState(); } catch (_) {}
		const profile = profilesList.find(p => p.id === currentProfileId);
		const name = profile ? profile.name : '未命名班级';
		let state = {};
		let meta = {};
		try { const raw = localStorage.getItem(getStateKey(currentProfileId)); if (raw) state = JSON.parse(raw); } catch (_) {}
		try { const m = localStorage.getItem(getMetaKey(currentProfileId)); if (m) meta = JSON.parse(m); } catch (_) {}
		const payload = { type: 'rollcall-profile', version: 1, name, state, meta };
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const ts = new Date();
		const pad = (n) => String(n).padStart(2, '0');
		const fname = `rollcall_profile_${name}_${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}_${pad(ts.getHours())}${pad(ts.getMinutes())}${pad(ts.getSeconds())}.json`;
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = fname;
		document.body.appendChild(a);
		a.click();
		setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
	};

	const importProfileFromFile = (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const obj = JSON.parse(String(reader.result || '{}'));
				let name = String(obj && obj.name) || (file.name.replace(/\.json$/i, '')) || '导入班级';
				let state = obj && obj.state ? obj.state : obj; // 兼容直接导入状态对象
				if (!state || typeof state !== 'object') { showTip('导入文件格式不正确'); return; }
				const id = generateProfileId();
				profilesList.push({ id, name });
				// 清理异常字段
				if (!Array.isArray(state.weightRules)) state.weightRules = [];
				if (!Array.isArray(state.picked)) state.picked = [];
				if (!Array.isArray(state.history)) state.history = [];
				// 应用并保存主题色
				try { if (state.themeColor) applyThemeColor(state.themeColor); } catch (_) {}
				localStorage.setItem(getStateKey(id), JSON.stringify(state));
				if (obj && obj.meta) localStorage.setItem(getMetaKey(id), JSON.stringify(obj.meta));
				saveProfilesStructure();
				populateProfileSelects();
				setCurrentProfile(id);
				showTip('导入成功');
			} catch (e) {
				showTip('导入失败：' + e.message);
			}
		};
		reader.readAsText(file);
	};
	const openWeights = () => {
		if (!weightsSheet) return;
		weightsSheet.classList.remove('hidden');
		requestAnimationFrame(() => weightsSheet.classList.add('is-open'));
		document.body.style.overflow = 'hidden';
		renderWeightsList();
		updateWeightsTotal();
	};

	const closeWeights = () => {
		if (!weightsSheet) return;
		weightsSheet.classList.remove('is-open');
		setTimeout(() => weightsSheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	const makeWeightRow = (entryId, percent, index) => {
		const row = document.createElement('div');
		row.className = 'weui-cell';
		row.innerHTML = `
			<div class="weui-cell__bd">
				<div class=\"weights-row\">
					<label>学号 <input type=\"number\" class=\"rc-input rc-input--small js-w-id\" value=\"${entryId}\"></label>
					<label>百分比 <input type=\"number\" class=\"rc-input rc-input--percent js-w-percent\" min=\"0\" max=\"100\" value=\"${percent}\"><span class=\"unit\">%</span></label>
				</div>
			</div>
			<div class=\"weui-cell__ft\">
				<button class=\"weui-btn weui-btn_mini weui-btn_warn js-w-del\">删除</button>
			</div>
		`;
		row.querySelector('.js-w-id').addEventListener('input', (e) => {
			const v = Math.floor(Number(e.target.value));
			if (!Number.isFinite(v)) return;
			// 更新键：删除旧键，写入新键
			const oldId = entryId;
			const p = weightMap.get(oldId) || 0;
			if (oldId !== v) {
				if (weightMap.has(v)) {
					showTip('该学号已在列表中');
					e.target.value = String(oldId);
					return;
				}
				weightMap.delete(oldId);
				entryId = v;
				weightMap.set(entryId, p);
			}
			updateWeightsTotal();
			saveState();
		});
		row.querySelector('.js-w-id').addEventListener('blur', (e) => {
			const val = String(e.target.value || '').trim();
			if (!/^\-?\d+$/.test(val)) {
				showTip('学号需为整数');
				e.target.value = String(entryId);
			}
		});
		row.querySelector('.js-w-percent').addEventListener('input', (e) => {
			let v = Number(e.target.value);
			if (!Number.isFinite(v)) v = 0;
			v = Math.max(0, Math.min(1000, Math.floor(v)));
			weightMap.set(entryId, v);
			updateWeightsTotal();
			saveState();
		});
		row.querySelector('.js-w-percent').addEventListener('blur', (e) => {
			const vv = Number(e.target.value);
			if (!Number.isFinite(vv)) {
				showTip('百分比需为数字');
				e.target.value = String(weightMap.get(entryId) || 0);
			}
		});
		row.querySelector('.js-w-del').addEventListener('click', () => {
			weightMap.delete(entryId);
			renderWeightsList();
			updateWeightsTotal();
			saveState();
		});
		return row;
	};

	const renderWeightsList = () => {
		if (!weightsList) return;
		weightsList.innerHTML = '';
		// 固定顺序，避免局部更新引发排序变化导致看起来"只有第一个生效"错觉
		const entries = Array.from(weightMap.entries()).sort((a,b) => a[0]-b[0]);
		entries.forEach(([id, percent], idx) => {
			weightsList.appendChild(makeWeightRow(id, percent, idx));
		});
		if (weightMap.size === 0) {
            const empty = document.createElement('div');
            empty.className = 'weui-cell';
            empty.innerHTML = '<div class="weui-cell__bd" style="color:var(--muted);">暂无学号，点击"添加学号"开始配置</div>';
			weightsList.appendChild(empty);
		}
	};

	const updateWeightsTotal = () => {
		if (!weightsTotal) return;
		let total = 0;
		for (const [id, p] of weightMap.entries()) {
			// 仅统计当前范围内未被排除/可选的学号
			const [min, max] = clampRange(Number(inputMin.value), Number(inputMax.value));
			const excludeSet = parseExclude(inputExclude.value);
			const ignoreNR = !!(switchNoRepeat.checked && switchWeightsIgnoreNoRepeat && switchWeightsIgnoreNoRepeat.checked);
			if (id >= min && id <= max && !excludeSet.has(id) && (!switchNoRepeat.checked || ignoreNR || !pickedSet.has(id))) {
				total += Math.max(0, Number(p) || 0);
			}
		}
		weightsTotal.textContent = `${total}%`;
	};

	const applyRangeBarVisible = () => {
		if (!rangeBar || !switchShowRangeBar) return;
		rangeBar.classList.toggle('hidden', !switchShowRangeBar.checked);
	};

	const updateAutoSecondsUI = () => {
		autoSeconds = inputAutoSeconds ? Math.min(10, Math.max(1, Number(inputAutoSeconds.value) || 5)) : autoSeconds;
		if (autoSecondsPreview) autoSecondsPreview.textContent = String(autoSeconds);
		if (btnAuto5s) btnAuto5s.textContent = `${autoSeconds}秒随机抽人`;
	};

	const openSettings = () => {
		settingsSheet.classList.remove('hidden');
		// 触发动画
		requestAnimationFrame(() => settingsSheet.classList.add('is-open'));
		document.body.style.overflow = 'hidden';
		// 不再自动聚焦搜索，也不进入 focusing 状态，避免打开即键入
		setTimeout(() => {
			try {
				if (settingsSearchBar) settingsSearchBar.classList.remove('weui-search-bar_focusing');
			} catch (_) {}
		}, 60);
	};

	const closeSettings = () => {
		settingsSheet.classList.remove('is-open');
		// 等待动画结束后再隐藏
		setTimeout(() => settingsSheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	// 设置搜索过滤
	const SETTINGS_SECTION_TITLE = 'weui-cells__title';
	const SETTINGS_ROW = 'weui-cell';
	function filterSettings(keyword) {
		const root = settingsSheet && settingsSheet.querySelector('.sheet__content');
		if (!root) return;
    const q = String(keyword || '').trim().toLowerCase();
		const titles = Array.from(root.querySelectorAll('.' + SETTINGS_SECTION_TITLE));
		const rows = Array.from(root.querySelectorAll('.' + SETTINGS_ROW));
		let anyShown = false;
		// 先隐藏空提示
		settingsSearchEmpty && settingsSearchEmpty.classList.add('hidden');
		// 重置显示
		titles.forEach(el => el.classList.remove('hidden'));
		rows.forEach(el => el.classList.remove('hidden'));
		if (!q) return; // 无关键字显示全部
		// 过滤行
    rows.forEach(el => {
            const extra = (el.getAttribute('data-search') || '').toLowerCase();
            const text = ((el.textContent || '') + ' ' + extra).toLowerCase();
			const hit = text.includes(q);
			if (!hit) el.classList.add('hidden');
			else anyShown = true;
		});
		// 隐藏没有任何可见行的标题
		titles.forEach(title => {
			let sibling = title.nextElementSibling;
			let hasVisible = false;
			while (sibling && !sibling.classList.contains(SETTINGS_SECTION_TITLE)) {
				if (!sibling.classList.contains('hidden')) { hasVisible = true; break; }
				sibling = sibling.nextElementSibling;
			}
			if (!hasVisible) title.classList.add('hidden');
		});
        if (!anyShown) settingsSearchEmpty && settingsSearchEmpty.classList.remove('hidden');
	}

	// 新功能弹窗逻辑已抽离到 modules/whatsnew.js

	const openRoster = () => {
		if (!rosterSheet) return;
		rosterSheet.classList.remove('hidden');
		requestAnimationFrame(() => rosterSheet.classList.add('is-open'));
		document.body.style.overflow = 'hidden';
	};

  // 主题色弹窗
  const openTheme = () => {
    if (!themeSheet) return;
    themeSheet.classList.remove('hidden');
    requestAnimationFrame(() => themeSheet.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    // 初始化颜色为当前 --brand
    try {
      const current = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
      if (current && inputThemeColor) inputThemeColor.value = toHexColor(current) || '#12b76a';
    } catch (_) {}
  };

	// 记录功能已移除

  const closeTheme = () => {
    if (!themeSheet) return;
    themeSheet.classList.remove('is-open');
    setTimeout(() => themeSheet.classList.add('hidden'), 280);
    document.body.style.overflow = '';
  };

  const toHexColor = (c) => {
    // 支持 rgb(a) 或 #hex
    c = String(c || '').trim();
    if (/^#([\da-f]{3}|[\da-f]{6})$/i.test(c)) return c;
    const m = c.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
      const r = Number(m[1])|0, g = Number(m[2])|0, b = Number(m[3])|0;
      const hex = (n) => ('0' + n.toString(16)).slice(-2);
      return `#${hex(r)}${hex(g)}${hex(b)}`;
    }
    return null;
  };

  const applyThemeColor = (hex) => {
    if (!hex) return;
    document.documentElement.style.setProperty('--brand', hex);
    // 让 CSS 依据 var(--brand) 自动推导其他派生色，避免覆盖深色模式下的高亮规则
    try {
      document.documentElement.style.removeProperty('--brand-ink');
      document.documentElement.style.removeProperty('--ring');
      document.documentElement.style.removeProperty('--brand-600');
      const meta = document.getElementById('metaThemeColor');
      if (meta) meta.setAttribute('content', hex);
    } catch (_) {}
  };

  const CUSTOM_COLORS_KEY = 'rollcall:themeCustomColors';
  const loadCustomColors = () => {
    try {
      const raw = localStorage.getItem(CUSTOM_COLORS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list) && themeCustomColors) {
        themeCustomColors.innerHTML = list.map(c => `<button class="swatch" data-color="${c}" style="--c:${c}" title="${c}"></button>`).join('');
      }
    } catch (_) {}
  };
  const saveCustomColor = (hex) => {
    try {
      const raw = localStorage.getItem(CUSTOM_COLORS_KEY);
      let list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      if (!list.includes(hex)) {
        list.unshift(hex);
        // 最多保留 12 个
        if (list.length > 12) list = list.slice(0, 12);
        localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(list));
      }
    } catch (_) {}
  };

	const closeRoster = () => {
		if (!rosterSheet) return;
		rosterSheet.classList.remove('is-open');
		setTimeout(() => rosterSheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	// 智能抽取弹窗控制
	const openAdvanced = () => {
		if (!advancedSheet) return;
		advancedSheet.classList.remove('hidden');
		requestAnimationFrame(() => advancedSheet.classList.add('is-open'));
		document.body.style.overflow = 'hidden';
		// 打开时同步 UI
		try {
			if (switchBalancedMode) switchBalancedMode.checked = !!balancedEnabled;
			if (inputBalancedBoost) inputBalancedBoost.value = String(Math.min(3, Math.max(1, Number(balancedBoostMax) || 2)));
			if (balancedBoostPreview) {
				const mx = Math.min(3, Math.max(1, Number(balancedBoostMax) || 2));
				balancedBoostPreview.textContent = `1.00x ~ ${mx.toFixed(2)}x`;
			}
			// 同步提示可见性
			syncSmartHintVisibility();
		} catch (_) {}
	};

	const closeAdvanced = () => {
		if (!advancedSheet) return;
		advancedSheet.classList.remove('is-open');
		setTimeout(() => advancedSheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	const startRoll = () => {
		if (isRolling) return;
		// 校验最小/最大是否已填写
		const minStr = String(inputMin?.value ?? '').trim();
		const maxStr = String(inputMax?.value ?? '').trim();
		const hasMin = minStr !== '' && Number.isFinite(Number(minStr));
		const hasMax = maxStr !== '' && Number.isFinite(Number(maxStr));
		if (!hasMin || !hasMax) {
			try { (!hasMin ? inputMin : inputMax)?.focus(); } catch (_) {}
			try { showBanner && showBanner('请填写最大和最小学号阈值后再开始', 'red', 5000, { showClose: true }); } catch (_) {}
			return;
		}
		const [minRaw, maxRaw] = [Number(inputMin.value), Number(inputMax.value)];
		// 顺序校验：最小值必须小于最大值
		if (!(minRaw < maxRaw)) {
			let msg = '';
			if (minRaw > maxRaw) msg = `最小值应该小于最大值，你输入的${minRaw}不合规`;
			else msg = `最大值应该大于最小值，你输入的${maxRaw}不合格`;
			try { showBanner && showBanner(msg, 'red', 5000, { showClose: true }); } catch (_) {}
			try { (minRaw >= maxRaw ? inputMin : inputMax)?.focus(); } catch (_) {}
			return;
		}
		const [min, max] = clampRange(minRaw, maxRaw);
		const excludeSet = parseExclude(inputExclude.value);
		const noRepeat = switchNoRepeat.checked;
		const canPick = sampleInt(min, max, excludeSet, noRepeat);
		if (canPick == null) {
			const msg = '系统中可选的学号为空（都抽完了TAT），请检查"范围/排除/不重复/概率"设置';
			try { showBanner && showBanner(msg, 'red', 5000, { showClose: true }); }
			catch (_) { try { alert(msg); } catch (_) {} }
			return;
		}
		isRolling = true;
		// 先按未滚动状态记录并锁定固定高度，确保开始后不变小
		setFixedDisplayHeight();
        startButtons.forEach(b => b.classList.add('hidden'));
        stopButtons.forEach(b => b.classList.remove('hidden'));
        // 隐藏结果操作栏
        if (resultActions) {
            resultActions.classList.remove('is-show');
            resultActions.classList.add('hidden');
        }
		document.querySelector('.app')?.classList.toggle('rolling', switchAnimate.checked);
		// 下一帧再锁定一次，确保最终高度稳定
		requestAnimationFrame(() => lockDisplayBoxHeight());
		const exclude = excludeSet;
		const animate = switchAnimate.checked;
		timerId = setInterval(() => {
			// 滚动中：使用独立概率模块，实时应用权重/均衡/智慧统计
			let n = null;
			if (window.Probability && typeof window.Probability.sample === 'function') {
				n = window.Probability.sample({
					min, max,
					excludeSet: exclude,
					noRepeat,
					isRolling: true,
					weightsEnabled,
					weightsMaskEnabled,
					weightMap,
					balancedEnabled,
					lastPickedAtMap,
					balancedBoostMax,
					smartStatsEnabled,
					smartStats,
                    smartStatsDecayEnabled,
                    alphaOverride: SMART_WRONG_ALPHA,
                    correctDecayOverride: SMART_CORRECT_DECAY,
					pickedSet,
					weightsIgnoreNoRepeat,
				});
			} else {
				// 兜底：旧实现
				n = sampleInt(min, max, exclude, noRepeat);
			}
			updateDisplay(n);
		}, animate ? 60 : 100);
	};

	const stopRoll = () => {
		if (!isRolling) return;
		isRolling = false;
        startButtons.forEach(b => b.classList.remove('hidden'));
        stopButtons.forEach(b => b.classList.add('hidden'));
		clearInterval(timerId);
		timerId = null;
		document.querySelector('.app')?.classList.remove('rolling');
		// 停止后也保持固定高度，直到用户下一次显式刷新/改变布局
		lockDisplayBoxHeight();

		// 如果处于读秒，取消动画帧并恢复界面
		if (countdownActive) {
			countdownActive = false;
			if (countdownRAF) cancelAnimationFrame(countdownRAF);
			countdownRAF = 0;
		}
		if (displayCountdown) displayCountdown.classList.add('hidden');
		if (displayNumber) displayNumber.style.visibility = '';
		if (displayName) displayName.style.visibility = '';
		if (displayLabel) displayLabel.textContent = prevLabelText || '当前学号';

		const [min, max] = clampRange(Number(inputMin.value), Number(inputMax.value));
		const excludeSet = parseExclude(inputExclude.value);
		const noRepeat = switchNoRepeat.checked;
		// 停止时：若开启掩盖概率，最终结果必须按权重/均衡抽取
		let n = null;
		if (window.Probability && typeof window.Probability.sample === 'function') {
			n = window.Probability.sample({
				min, max,
				excludeSet,
				noRepeat,
				isRolling: false, // 停止时强制应用加权（即使开启掩盖）
				weightsEnabled,
				weightsMaskEnabled,
				weightMap,
				balancedEnabled,
				lastPickedAtMap,
				balancedBoostMax,
				smartStatsEnabled,
				smartStats,
                smartStatsDecayEnabled,
                alphaOverride: SMART_WRONG_ALPHA,
                correctDecayOverride: SMART_CORRECT_DECAY,
				pickedSet,
				weightsIgnoreNoRepeat,
			});
		} else {
			n = sampleInt(min, max, excludeSet, noRepeat);
		}
		if (n == null) {
			updateDisplay(null);
			return;
		}
		updateDisplay(n);
		displayNumber.classList.remove('pop');
		void displayNumber.offsetWidth; // 触发重绘
		displayNumber.classList.add('pop');
		requestAnimationFrame(fitDisplayNumber);

		// 彩带效果
	try { window.launchConfetti && window.launchConfetti(); } catch (_) {}
		if (noRepeat) pickedSet.add(n);
		const item = {
			number: n,
			name: rosterMap.get(n) || '',
			time: new Date().toLocaleString(),
		};
		pickedStack.push(item);
        // 记录一次被抽到
        try { recordSmartStats(n, 'picked'); } catch (_) {}
		try { lastPickedAtMap.set(n, Date.now()); } catch (_) {}
		// 若标记了均衡影响，则写入记录
		try {
			if (balancedEnabled && lastPickWasBalanced) {
				appendBalancedLog(n, Date.now());
			}
		} catch (_) {}
		lastPickWasBalanced = false;
		renderHistory();
		saveState();
		// 保持容器高度一致（不释放高度）
		refreshAndLockDisplayBoxHeight();
        // 显示结果操作栏，缓缓出现
        if (resultActions) {
            resultActions.classList.remove('hidden');
            requestAnimationFrame(() => resultActions.classList.add('is-show'));
        }
	};

const resetAll = () => {
    pickedSet.clear();
    pickedStack = [];
    lastPickedAtMap.clear();
    // 不清空智能抽取记录
    updateDisplay(null);
    renderHistory();
    saveState();
};

	const undoLast = () => {
		const last = pickedStack.pop();
		if (!last) return;
		pickedSet.delete(last.number);
		try { lastPickedAtMap.delete(last.number); } catch (_) {}
		updateDisplay(last.number);
		renderHistory();
		saveState();
	};

	const clearHistory = () => {
		pickedStack = [];
		renderHistory();
		saveState();
	};

	const applyRoster = () => {
		rosterMap = parseRoster(textareaRoster.value);
		const current = Number(displayNumber.textContent);
		if (Number.isFinite(current)) updateDisplay(current);
	};

    /** 智慧统计：记录与报表 **/
    const recordSmartStats = (id, type) => {
        if (!smartStatsEnabled) return;
        const key = getMonthKey();
        if (!smartStats[key]) smartStats[key] = {};
        if (!smartStats[key][id]) smartStats[key][id] = { picked: 0, correct: 0, wrong: 0 };
        smartStats[key][id].picked += (type === 'picked' ? 1 : 0);
        if (type === 'correct') smartStats[key][id].correct += 1;
        if (type === 'wrong') smartStats[key][id].wrong += 1;
        saveState();
    };

    const openSmartStats = () => {
        if (!smartStatsSheet) return;
        smartStatsSheet.classList.remove('hidden');
        requestAnimationFrame(() => smartStatsSheet.classList.add('is-open'));
        document.body.style.overflow = 'hidden';
        // 设置标题：x班 智慧统计（基于当前班级名称）
        try {
            const prof = profilesList.find(p => p.id === currentProfileId);
            const title = prof && prof.name ? `${prof.name} 智慧统计` : '智慧统计';
            const header = document.getElementById('smartStatsHeader');
            if (header) header.firstChild && (header.firstChild.nodeValue = title);
        } catch (_) {}
        renderSmartStats();
    };
    const closeSmartStats = () => {
        if (!smartStatsSheet) return;
        smartStatsSheet.classList.remove('is-open');
        setTimeout(() => smartStatsSheet.classList.add('hidden'), 280);
        document.body.style.overflow = '';
    };

    const renderSmartStats = () => {
        if (!smartStatsTopPicked || !smartStatsTopCorrect || !smartStatsTopWrong) return;
        const mk = getMonthKey();
        if (smartStatsMonthTitle) smartStatsMonthTitle.textContent = `${mk} 统计`;
        const data = smartStats[mk] || {};
        const rows = Object.entries(data).map(([id, rec]) => ({ id: Number(id), ...rec }));
        const totalPicked = rows.reduce((s, x) => s + (x.picked || 0), 0) || 0;
        const topN = (arr, key) => {
            const filtered = key === 'correct' ? arr.filter(x => (x.correct||0) > 0) : arr;
            return filtered.slice().sort((a,b) => (b[key]||0)-(a[key]||0)).slice(0,3);
        };
        const renderList = (el, list, key) => {
            if (!el) return;
            el.innerHTML = '';
            // 列表头说明已移动到标题右侧，这里不再添加
            if (list.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'weui-cell';
                empty.innerHTML = '<div class="weui-cell__bd" style="color:var(--muted);">暂无数据</div>';
                el.appendChild(empty);
                return;
            }
            list.forEach((rec, idx) => {
                const row = document.createElement('div');
                row.className = 'weui-cell';
                const name = rosterMap.get(rec.id) || '';
                const picked = rec.picked || 0;
                const correct = rec.correct || 0;
                const pickedRate = totalPicked > 0 ? Math.round(picked / totalPicked * 100) : 0;
                const accRate = picked > 0 ? Math.round(correct / picked * 100) : 0;
                const right = key === 'picked' ? `${picked}` : `${rec[key]||0}`;
                row.innerHTML = `<div class=\"weui-cell__bd\">#${idx+1} 学号 ${rec.id} ${name ? '· '+name : ''}</div><div class=\"weui-cell__ft\">${right}（${pickedRate}% , ${accRate}%）</div>`;
                el.appendChild(row);
            });
        };
        renderList(smartStatsTopPicked, topN(rows, 'picked'), 'picked');
        renderList(smartStatsTopCorrect, topN(rows, 'correct'), 'correct');
        renderList(smartStatsTopWrong, topN(rows, 'wrong'), 'wrong');
    };

	/** 自定义名单：辅助工具 **/
	const { parseRosterLines, normalizeRoster, sortRosterById, sortRosterByName, dedupeRosterById, trimRosterEmptyLines } = window.Roster;

	const updateRosterStats = () => {
		if (!rosterStats || !textareaRoster) return;
		const raw = String(textareaRoster.value || '');
		const totalLines = raw.replace(/[\r]+/g, '').split(/\n/).filter(() => true).length;
		const { entries, invalid } = parseRosterLines(raw);
		let duplicateCount = 0;
		const seen = new Set();
		for (const e of entries) { if (seen.has(e.id)) duplicateCount++; else seen.add(e.id); }
		const validCount = entries.length;
		const invalidCount = invalid.length;
		rosterStats.textContent = `共 ${totalLines} 行 · 合法 ${validCount} · 无效 ${invalidCount} · 重复 ${duplicateCount}`;
	};

	const setRosterAndRefresh = (text) => {
		if (!textareaRoster) return;
		textareaRoster.value = text;
		applyRoster();
		updateRosterStats();
		saveState();
	};

	const copyRosterToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(String(textareaRoster?.value || ''));
			showTip('已复制到剪贴板');
		} catch (_) {
			try {
				textareaRoster?.select();
				document.execCommand('copy');
				showTip('已复制');
			} catch (e) { showTip('复制失败'); }
		}
	};

	const pasteFromClipboard = async () => {
		if (!textareaRoster) return;
		try {
			const text = await navigator.clipboard.readText();
			if (!text) return;
			const el = textareaRoster;
			const start = el.selectionStart || el.value.length;
			const end = el.selectionEnd || el.value.length;
			const before = el.value.slice(0, start);
			const after = el.value.slice(end);
			const insert = text.replace(/[\r]+/g, '');
			setRosterAndRefresh(before + insert + after);
			// 恢复光标
			const newPos = start + insert.length;
			requestAnimationFrame(() => { try { el.selectionStart = el.selectionEnd = newPos; el.focus(); } catch (_) {} });
		} catch (e) { showTip('读取剪贴板失败'); }
	};

	const toggleTheme = () => {
		const isDark = document.documentElement.classList.toggle('theme-dark');
		document.body?.setAttribute('data-weui-theme', isDark ? 'dark' : 'light');
		saveState();
	};

	const setFooterInfo = () => {
		const browserInfoEl = document.getElementById('browserInfo');
		const versionEl = document.getElementById('appVersion');
		const copyrightEl = document.getElementById('copyright');

		const ua = navigator.userAgent;
		let kernel = '';
		if (/Chrome\/([\d.]+)/.test(ua)) kernel = `Chromium ${RegExp.$1}`;
		else if (/Edg\/([\d.]+)/.test(ua)) kernel = `Edge ${RegExp.$1}`;
		else if (/Firefox\/([\d.]+)/.test(ua)) kernel = `Gecko ${RegExp.$1}`;
		else if (/Safari\//.test(ua)) kernel = 'WebKit';

		let os = '';
		if (/Windows NT ([\d.]+)/.test(ua)) os = `Windows ${RegExp.$1}`;
		else if (/Mac OS X ([\d_]+)/.test(ua)) os = `macOS ${RegExp.$1.replace(/_/g,'.')}`;
		else if (/Android ([\d.]+)/.test(ua)) os = `Android ${RegExp.$1}`;
		else if (/(iPhone|iPad); CPU .* OS ([\d_]+)/.test(ua)) os = `iOS ${RegExp.$2.replace(/_/g,'.')}`;

		if (browserInfoEl) browserInfoEl.textContent = `${kernel || 'Unknown'} · ${os || 'Unknown OS'}`;
		if (versionEl) {
			versionEl.textContent = 'v3.1.4';
		}
		if (copyrightEl) {
			const year = new Date().getFullYear();
			copyrightEl.textContent = `© ${year}`;
		}
	};

	/** 顶部横幅 API **/
	// 顶部横幅逻辑已抽离到 modules/banner.js

	/** 事件绑定 **/
	startButtons.forEach(b => b.addEventListener('click', startRoll));
	stopButtons.forEach(b => b.addEventListener('click', stopRoll));
	// 历史已移除（保留逻辑以便将来扩展，但不渲染）
	btnOpenSettings?.addEventListener('click', openSettings);
	btnSettingsCancel?.addEventListener('click', closeSettings);
	btnSettingsClose?.addEventListener('click', closeSettings);
	btnSettingsSave?.addEventListener('click', () => {
		applyRoster();
		saveState();
		closeSettings();
	});
	btnToggleTheme?.addEventListener('click', toggleTheme);
	// 新功能弹窗和横幅事件由对应模块内部绑定

	// 当窗口尺寸或滚动变化时，若横幅可见，保持其紧贴页眉下方
	const syncBannerPosition = () => {
		if (!topBanner || topBanner.classList.contains('hidden')) return;
		try {
			const rect = headerEl ? headerEl.getBoundingClientRect() : { bottom: 0 };
			const top = Math.max(0, rect.bottom + 8 + (window.scrollY || window.pageYOffset || 0));
			topBanner.style.top = top + 'px';
		} catch (_) {}
	};
	window.addEventListener('resize', syncBannerPosition);
	window.addEventListener('scroll', syncBannerPosition, { passive: true });
	btnOpenRoster?.addEventListener('click', openRoster);
	btnRosterClose?.addEventListener('click', closeRoster);
	btnRosterCancel?.addEventListener('click', closeRoster);
	btnRosterSave?.addEventListener('click', () => {
		applyRoster();
		saveState();
		closeRoster();
	});
	btnRosterClear?.addEventListener('click', () => {
		if (textareaRoster) textareaRoster.value = '';
		applyRoster();
		saveState();
	});

  // 设置搜索事件
  // WeUI 搜索交互
  settingsSearchInput?.addEventListener('input', (e) => {
    const val = e.target.value || '';
    filterSettings(val);
    if (settingsSearchBar) settingsSearchBar.classList.toggle('weui-search-bar_focusing', !!val || document.activeElement === settingsSearchInput);
  });
  settingsSearchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      settingsSearchInput.value = '';
      filterSettings('');
      e.preventDefault();
    }
  });
  settingsSearchInput?.addEventListener('focus', () => {
    if (settingsSearchBar) settingsSearchBar.classList.add('weui-search-bar_focusing');
  });
  settingsSearchInput?.addEventListener('blur', () => {
    const hasVal = !!(settingsSearchInput && settingsSearchInput.value);
    if (settingsSearchBar && !hasVal) settingsSearchBar.classList.remove('weui-search-bar_focusing');
    // 退出键入：隐藏"未找到相关设置"提示
    if (!hasVal && settingsSearchEmpty) settingsSearchEmpty.classList.add('hidden');
  });
  settingsSearchClear?.addEventListener('click', () => {
    if (!settingsSearchInput) return;
    settingsSearchInput.value = '';
    filterSettings('');
    settingsSearchInput.focus();
    if (settingsSearchEmpty) settingsSearchEmpty.classList.add('hidden');
  });
  settingsSearchCancel?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!settingsSearchInput) return;
    settingsSearchInput.value = '';
    filterSettings('');
    if (settingsSearchBar) settingsSearchBar.classList.remove('weui-search-bar_focusing');
    if (settingsSearchEmpty) settingsSearchEmpty.classList.add('hidden');
  });
  // 点击占位标签 -> 聚焦输入
  settingsSearchLabel?.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      if (settingsSearchBar) settingsSearchBar.classList.add('weui-search-bar_focusing');
      settingsSearchInput && settingsSearchInput.focus();
    } catch (_) {}
  });
  // 阻止表单提交刷新
  settingsSearchBar?.querySelector('.weui-search-bar__form')?.addEventListener('submit', (e) => e.preventDefault());
	btnOpenWeights?.addEventListener('click', openWeights);
  btnOpenTheme?.addEventListener('click', openTheme);
  btnThemeClose?.addEventListener('click', closeTheme);
  btnThemeCancel?.addEventListener('click', closeTheme);
  btnThemeReset?.addEventListener('click', () => {
    if (inputThemeColor) {
      inputThemeColor.value = '#12b76a';
      // 立即应用默认主题色，避免需要再次操作触发 input 事件
      try { applyThemeColor('#12b76a'); } catch (_) {}
    }
  });
  inputThemeColor?.addEventListener('input', () => applyThemeColor(inputThemeColor.value));
  themeSwatches?.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('swatch')) {
      const c = t.getAttribute('data-color');
      if (inputThemeColor) inputThemeColor.value = c;
      applyThemeColor(c);
    }
  });
  // 右键自定义色块删除
  themeSwatches?.addEventListener('contextmenu', (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains('swatch') && themeCustomColors && themeCustomColors.contains(t)) {
      e.preventDefault();
      const c = t.getAttribute('data-color');
      try {
        const raw = localStorage.getItem(CUSTOM_COLORS_KEY);
        let list = raw ? JSON.parse(raw) : [];
        list = Array.isArray(list) ? list.filter(x => x !== c) : [];
        localStorage.setItem(CUSTOM_COLORS_KEY, JSON.stringify(list));
        loadCustomColors();
      } catch (_) {}
    }
  });
  btnThemeSaveCustom?.addEventListener('click', () => {
    const color = inputThemeColor ? String(inputThemeColor.value || '').trim() : '';
    if (!color) return;
    saveCustomColor(color);
    loadCustomColors();
  });
  btnThemeSave?.addEventListener('click', () => {
    try {
      const color = inputThemeColor ? String(inputThemeColor.value || '').trim() : '';
      if (color) localStorage.setItem('rollcall:themeColor', color);
    } catch (_) {}
    // 保存到当前班级配置
    try { saveState(); } catch (_) {}
    closeTheme();
  });

    // 结果操作栏事件
    btnMarkCorrect?.addEventListener('click', () => {
        const n = Number(displayNumber?.textContent);
        if (!Number.isFinite(n)) return;
        try { recordSmartStats(n, 'correct'); } catch (_) {}
        // 操作后隐藏操作栏
        if (resultActions) { resultActions.classList.remove('is-show'); setTimeout(()=>resultActions.classList.add('hidden'), 240); }
    });
    btnMarkWrong?.addEventListener('click', () => {
        const n = Number(displayNumber?.textContent);
        if (!Number.isFinite(n)) return;
        try { recordSmartStats(n, 'wrong'); } catch (_) {}
        if (resultActions) { resultActions.classList.remove('is-show'); setTimeout(()=>resultActions.classList.add('hidden'), 240); }
    });
    btnMarkSkip?.addEventListener('click', () => {
        if (resultActions) { resultActions.classList.remove('is-show'); setTimeout(()=>resultActions.classList.add('hidden'), 240); }
    });

    // 智慧统计弹窗事件
    btnOpenSmartStats?.addEventListener('click', openSmartStats);
    btnSmartStatsClose?.addEventListener('click', closeSmartStats);
    btnSmartStatsOk?.addEventListener('click', closeSmartStats);
    switchSmartStats?.addEventListener('change', () => { smartStatsEnabled = !!switchSmartStats.checked; saveState(); });
    switchSmartStatsDecay?.addEventListener('change', () => { smartStatsDecayEnabled = !!switchSmartStatsDecay.checked; saveState(); });
    inputSmartWrongAlpha?.addEventListener('input', () => {
        const a = Math.max(2, Math.min(5, Number(inputSmartWrongAlpha.value) || 2));
        SMART_WRONG_ALPHA = a;
        if (smartWrongAlphaPreview) smartWrongAlphaPreview.textContent = `${a.toFixed(2)}x`;
        const p = ((a - 2) / 3) * 100; // 2~5 -> 0~100
        inputSmartWrongAlpha.style.setProperty('--_val', p + '%');
    });
    inputSmartWrongAlpha?.addEventListener('change', () => { saveState(); });
    inputSmartCorrectDecay?.addEventListener('input', () => {
        const d = Math.max(0, Math.min(1, Number(inputSmartCorrectDecay.value) || 0));
        SMART_CORRECT_DECAY = d;
        if (smartCorrectDecayPreview) smartCorrectDecayPreview.textContent = d.toFixed(2);
        inputSmartCorrectDecay.style.setProperty('--_val', (d * 100) + '%');
    });
    inputSmartCorrectDecay?.addEventListener('change', () => { saveState(); });

    // 重置智慧统计与权重
    document.getElementById('btnSmartReset')?.addEventListener('click', () => {
        if (!confirm('确定要重置智慧统计与权重吗？')) return;
        // 清空统计
        try { smartStats = {}; localStorage.setItem(getMetaKey(currentProfileId)+':smartStats', '{}'); } catch (_) {}
        // 重置强度
        SMART_WRONG_ALPHA = 2.0; SMART_CORRECT_DECAY = 0.6; smartStatsDecayEnabled = false;
        if (inputSmartWrongAlpha) { inputSmartWrongAlpha.value = '2'; inputSmartWrongAlpha.dispatchEvent(new Event('input')); }
        if (inputSmartCorrectDecay) { inputSmartCorrectDecay.value = '0.6'; inputSmartCorrectDecay.dispatchEvent(new Event('input')); }
        if (switchSmartStatsDecay) { switchSmartStatsDecay.checked = false; }
        // 清空显式权重
        weightMap = new Map();
        renderWeightsList && renderWeightsList();
        updateWeightsTotal && updateWeightsTotal();
        saveState();
        alert('已重置。');
    });
	btnWeightsClose?.addEventListener('click', closeWeights);
	btnWeightsCancel?.addEventListener('click', closeWeights);
	btnWeightsSave?.addEventListener('click', () => {
		weightsEnabled = !!(switchEnableWeights && switchEnableWeights.checked);
		weightsMaskEnabled = !!(switchWeightsMask && switchWeightsMask.checked);
		weightsIgnoreNoRepeat = !!(switchWeightsIgnoreNoRepeat && switchWeightsIgnoreNoRepeat.checked);
		saveState();
		closeWeights();
	});
	btnWeightsAddId?.addEventListener('click', () => {
		const [min, max] = clampRange(Number(inputMin.value), Number(inputMax.value));
		let candidate = min;
		while (candidate <= max && weightMap.has(candidate)) candidate++;
		if (candidate > max) {
			showTip('当前范围内学号已全部添加');
			return;
		}
		weightMap.set(candidate, 0);
		renderWeightsList();
		updateWeightsTotal();
		saveState();
	});
	btnWeightsClear?.addEventListener('click', () => {
		weightMap.clear();
		renderWeightsList();
		updateWeightsTotal();
		saveState();
	});
	btnWeightsAddGroup?.addEventListener('click', () => {
		const text = prompt('请输入学号组，例如：1,2,5-10, 20-22, 33');
		if (text == null) return;
		if (!/[\d-]/.test(text)) {
			showTip('格式错误，请输入整数或区间（例如：1,2,5-10）');
			return;
		}
		const ids = new Set();
		let hasInvalid = false;
		text.split(/[,，\s]+/).filter(Boolean).forEach(tok => {
			if (!/^\-?\d+(\s*-\s*\-?\d+)?$/.test(tok)) { hasInvalid = true; return; }
			const m = tok.match(/^(\-?\d+)\s*-\s*(\-?\d+)$/);
			if (m) {
				let a = Math.floor(Number(m[1]));
				let b = Math.floor(Number(m[2]));
				if (Number.isFinite(a) && Number.isFinite(b)) {
					if (a > b) [a, b] = [b, a];
					for (let i = a; i <= b; i++) ids.add(i);
				} else { hasInvalid = true; }
			} else {
				const n = Math.floor(Number(tok));
				if (Number.isFinite(n)) ids.add(n); else hasInvalid = true;
			}
		});
		if (hasInvalid || ids.size === 0) {
			showTip('存在非法输入，请检查格式（示例：1,2,5-10）');
			return;
		}
		ids.forEach(n => { if (!weightMap.has(n)) weightMap.set(n, 0); });
		renderWeightsList();
		updateWeightsTotal();
		saveState();
	});

	// 班级切换/管理事件
	profileSelect?.addEventListener('change', () => {
		setCurrentProfile(profileSelect.value);
	});
	profileSelectSettings?.addEventListener('change', () => {
		setCurrentProfile(profileSelectSettings.value);
	});
	btnProfileNew?.addEventListener('click', () => {
		const name = prompt('请输入新班级名称', '新建班级');
		if (name == null) return;
		createProfile(String(name).trim() || '新建班级', true);
	});
	btnProfileRename?.addEventListener('click', () => {
		const prof = profilesList.find(p => p.id === currentProfileId);
		const name = prompt('重命名班级', prof ? prof.name : '');
		if (name == null) return;
		renameProfile(currentProfileId, String(name).trim() || '未命名班级');
	});
	btnProfileDelete?.addEventListener('click', () => {
		if (!confirm('确定删除当前班级吗？该操作不可恢复。')) return;
		deleteProfile(currentProfileId);
	});
	btnProfileExport?.addEventListener('click', () => exportCurrentProfile());
	btnProfileImport?.addEventListener('click', () => inputImportProfile && inputImportProfile.click());
	inputImportProfile?.addEventListener('change', (e) => {
		const file = e.target.files && e.target.files[0];
		if (file) importProfileFromFile(file);
		e.target.value = '';
	});


	switchEnableWeights?.addEventListener('change', () => {
		weightsEnabled = !!switchEnableWeights.checked;
		saveState();
	});

	switchWeightsMask?.addEventListener('change', () => {
		weightsMaskEnabled = !!switchWeightsMask.checked;
		saveState();
	});

	switchWeightsIgnoreNoRepeat?.addEventListener('change', () => {
		weightsIgnoreNoRepeat = !!switchWeightsIgnoreNoRepeat.checked;
		saveState();
		updateWeightsTotal();
	});

btnClearPicked?.addEventListener('click', () => {
    pickedSet.clear();
    pickedStack = [];
    lastPickedAtMap.clear();
    // 不清空智能抽取记录
    saveState();
    renderHistory();
    const current = Number(displayNumber.textContent);
    if (Number.isFinite(current)) updateDisplay(current);
    if (window.weui && typeof window.weui.toast === 'function') {
        window.weui.toast('已清空', 1500);
    }
});

	// 自动抽人（可配置 1-10 秒）
	btnAuto5s?.addEventListener('click', () => {
		if (isRolling) return;
		startRoll();
		// 如果未能开始滚动（例如可选学号为空）则直接返回
		if (!isRolling) return;

		const durationMs = (autoSeconds || 5) * 1000;
		const startTs = performance.now();
		countdownActive = true;
		prevLabelText = displayLabel?.textContent || '当前学号';
		if (displayLabel) displayLabel.textContent = '读秒';
		if (displayCountdown) {
			displayCountdown.classList.remove('hidden');
			// 隐藏学号与姓名，避免重叠
			if (displayNumber) displayNumber.style.visibility = 'hidden';
			if (displayName) displayName.style.visibility = 'hidden';
		}
		const tick = () => {
			if (!countdownActive) return; // 被手动终止
			const now = performance.now();
			let remain = Math.max(0, durationMs - (now - startTs));
			// 格式：秒.毫秒（3位）
			const s = Math.floor(remain / 1000);
			const ms = Math.floor(remain % 1000);
			if (displayCountdown) displayCountdown.textContent = `${s}.${String(ms).padStart(3,'0')}`;
			if (remain > 0) {
				countdownRAF = requestAnimationFrame(tick);
			} else {
				// 结束读秒，统一走 stopRoll 恢复界面并定结果
				countdownActive = false;
				stopRoll();
			}
		};
		countdownRAF = requestAnimationFrame(tick);
	});

	// —— 智能抽取弹窗事件 ——
	btnOpenAdvanced?.addEventListener('click', openAdvanced);
	btnAdvancedClose?.addEventListener('click', closeAdvanced);
	btnAdvancedCancel?.addEventListener('click', closeAdvanced);
	btnAdvancedSave?.addEventListener('click', () => {
		balancedEnabled = !!(switchBalancedMode && switchBalancedMode.checked);
		if (inputBalancedBoost) {
			balancedBoostMax = Math.min(3, Math.max(1, Number(inputBalancedBoost.value) || 2));
		}
		saveState();
		closeAdvanced();
	});
	btnBalancedLogClear?.addEventListener('click', () => {
		balancedLogs = [];
		try { localStorage.setItem(getMetaKey(currentProfileId)+':balancedLogs', '[]'); } catch (_) {}
		renderBalancedLogs();
	});
	// 即时保存
	switchBalancedMode?.addEventListener('change', () => { balancedEnabled = !!switchBalancedMode.checked; saveState(); });

inputBalancedBoost?.addEventListener('input', () => {
	const mx = Math.min(3, Math.max(1, Number(inputBalancedBoost.value) || 2));
	balancedBoostPreview && (balancedBoostPreview.textContent = `1.00x ~ ${mx.toFixed(2)}x`);
	// 更新背景进度条百分比，与自动时长滑条一致（范围 1-3 → 百分比）
	const p = (mx - 1) / 2 * 100;
	inputBalancedBoost.style.setProperty('--_val', p + '%');
});
inputBalancedBoost?.addEventListener('change', () => {
	balancedBoostMax = Math.min(3, Math.max(1, Number(inputBalancedBoost.value) || 2));
	saveState();
});
	// 种子相关事件已移除

	[inputMin, inputMax, inputExclude, switchNoRepeat, switchAnimate, switchShowRangeBar, inputAutoSeconds].forEach((el) => {
		el?.addEventListener('change', () => {
			saveState();
		});
	});

	// 输入排除学号时，自动将中文逗号等替换为英文逗号
	inputExclude?.addEventListener('input', (e) => {
		const v = String(e.target.value || '');
		// 仅保留数字、负号、逗号；把中文标点空白统一成英文逗号
		let normalized = v.replace(/[，、；;\s]+/g, ',').replace(/[^\d,\-]+/g, '').replace(/,+/g, ',');
		// 负号只允许出现在数字前面：把多余的负号去掉
		normalized = normalized.replace(/(,|^)-+(?=,|$)/g, '');
		if (normalized !== v) e.target.value = normalized;
	});

	// 不重复过期策略变更
	selectNoRepeatExpire?.addEventListener('change', () => {
		noRepeatExpire = selectNoRepeatExpire.value || 'session';
		saveState();
	});

	// 新增：实时更新可见性与预览
	switchShowRangeBar?.addEventListener('change', () => {
		applyRangeBarVisible();
	});
	inputAutoSeconds?.addEventListener('input', () => {
    updateAutoSecondsUI();
    // 更新背景进度条百分比
		if (inputAutoSeconds) {
			const p = (Number(inputAutoSeconds.value) - 1) / 9 * 100;
			inputAutoSeconds.style.setProperty('--_val', p + '%');
		}
	// 初始化均衡强度滑条背景
	if (inputBalancedBoost) {
		const mx = Math.min(3, Math.max(1, Number(inputBalancedBoost.value) || 2));
		const p2 = (mx - 1) / 2 * 100;
		inputBalancedBoost.style.setProperty('--_val', p2 + '%');
	}
	});

	textareaRoster?.addEventListener('input', () => {
		// 预览姓名显示
		applyRoster();
		requestAnimationFrame(fitDisplayNumber);
		updateRosterStats();
	});

	// 名单工具按钮事件
	btnRosterFormat?.addEventListener('click', () => setRosterAndRefresh(normalizeRoster(textareaRoster.value)));
	btnRosterSortId?.addEventListener('click', () => setRosterAndRefresh(sortRosterById(textareaRoster.value)));
	btnRosterSortName?.addEventListener('click', () => setRosterAndRefresh(sortRosterByName(textareaRoster.value)));
	btnRosterDedup?.addEventListener('click', () => setRosterAndRefresh(dedupeRosterById(textareaRoster.value)));
	btnRosterTrim?.addEventListener('click', () => setRosterAndRefresh(trimRosterEmptyLines(textareaRoster.value)));
	btnRosterCopy?.addEventListener('click', () => copyRosterToClipboard());
	btnRosterPaste?.addEventListener('click', () => pasteFromClipboard());

	// Ctrl+S / Cmd+S 保存名单
	textareaRoster?.addEventListener('keydown', (e) => {
		const isSave = (e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey);
		if (isSave) {
			e.preventDefault();
			btnRosterSave?.click();
		}
	});

	// 初始化
	loadProfilesStructure();
	populateProfileSelects();
	loadState();
	applyRoster();
	renderHistory();
	const last = pickedStack[pickedStack.length - 1];
	updateDisplay(last ? last.number : null);
	setFooterInfo();
	// 应用新增设置的初始状态
	applyRangeBarVisible();
	updateAutoSecondsUI();
	// 同步一次权重 UI
	if (weightsEnabled && switchEnableWeights) switchEnableWeights.checked = true;
  // 渲染自定义主题色
  loadCustomColors();
	// 初始化滑条背景
	if (inputAutoSeconds) {
		const p = (Number(inputAutoSeconds.value) - 1) / 9 * 100;
		inputAutoSeconds.style.setProperty('--_val', p + '%');
	}
  // 初始化智慧滑条背景
  if (inputSmartWrongAlpha) {
    const a = Math.max(2, Math.min(5, Number(inputSmartWrongAlpha.value) || 2));
    inputSmartWrongAlpha.style.setProperty('--_val', ((a - 2)/3*100) + '%');
  }
  if (inputSmartCorrectDecay) {
    const d = Math.max(0, Math.min(1, Number(inputSmartCorrectDecay.value) || 0));
    inputSmartCorrectDecay.style.setProperty('--_val', (d*100) + '%');
  }
	// 初始自适应与高度锁定
	setDynamicVhVar();
	refreshAndLockDisplayBoxHeight();
	fitDisplayNumber();
	// 渲染智能抽取记录
	try {
		const raw = localStorage.getItem(getMetaKey(currentProfileId)+':balancedLogs');
		balancedLogs = raw ? JSON.parse(raw) : [];
	} catch (_) { balancedLogs = []; }
	renderBalancedLogs();
	// 监听窗口/方向变化
	window.addEventListener('resize', () => {
		setDynamicVhVar();
		refreshAndLockDisplayBoxHeight();
	}, { passive: true });
	window.addEventListener('orientationchange', () => {
		setTimeout(() => { setDynamicVhVar(); refreshAndLockDisplayBoxHeight(); }, 60);
	});
	// 输入范围变化时，稳定数字最小宽度
	[inputMin, inputMax].forEach((el) => el?.addEventListener('input', () => requestAnimationFrame(fitDisplayNumber)));

	// —— 智慧统计-不重复提示逻辑 ——
    const syncSmartHintVisibility = () => {
        try {
            const visible = !!(switchNoRepeat && switchNoRepeat.checked);
            // 使用柔和淡出：先加软隐藏类再延迟真正隐藏
            const applySoftHide = (el, show, container) => {
                if (!el) return;
                if (show) {
                    container && container.classList.remove('is-hidden-soft');
                    container && container.classList.remove('hidden');
                    el.classList.remove('is-hidden-soft');
                    el.classList.remove('hidden');
                } else {
                    el.classList.add('is-hidden-soft');
                    container && container.classList.add('is-hidden-soft');
                    setTimeout(() => { el.classList.add('hidden'); container && container.classList.add('hidden'); }, 400);
                }
            };
            applySoftHide(hintDisableNoRepeat, visible, null);
            applySoftHide(hintDisableNoRepeatTop, visible, hintDisableNoRepeatTopRow);
        } catch (_) {}
    };
    // 点击“立即去关闭” -> 直接关闭开关并保存（两个位置共用）
    const handleDisableClick = (e) => {
        e && e.preventDefault();
        if (switchNoRepeat) {
            switchNoRepeat.checked = false;
            saveState();
            syncSmartHintVisibility();
            try { showBanner && showBanner('已关闭“不重复点到”', 'red', 5000, { showClose: false, slowFade: true }); } catch (_) { try { alert('已关闭“不重复点到”'); } catch (_) {} }
        }
    };
    actionDisableNoRepeat?.addEventListener('click', handleDisableClick);
    actionDisableNoRepeatTop?.addEventListener('click', handleDisableClick);
    // 当开关变化时，同步提示可见性
    switchNoRepeat?.addEventListener('change', () => { syncSmartHintVisibility(); });
	// 初次同步一次
	syncSmartHintVisibility();

	// 放开最小/最大输入：允许任意字符，解析时再校验
})();

// 彩带已抽离到 confetti.js
