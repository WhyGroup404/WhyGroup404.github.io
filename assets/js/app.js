/* 学号随机点名系统 - 绿色主题 */
(function () {
	'use strict';

	/** DOM 缓存 **/
	const inputMin = document.getElementById('inputMin');
	const inputMax = document.getElementById('inputMax');
	const inputExclude = document.getElementById('inputExclude');
	const btnStart = document.getElementById('btnStart');
	const btnStop = document.getElementById('btnStop');
	// 第二组按钮（底部）
	const startButtons = Array.from(document.querySelectorAll('.js-start'));
	const stopButtons = Array.from(document.querySelectorAll('.js-stop'));
	const btnReset = document.getElementById('btnReset');
	const displayNumber = document.getElementById('displayNumber');
	const displayName = document.getElementById('displayName');
	const displayCountdown = document.getElementById('displayCountdown');
	const historyList = document.getElementById('historyList');
	const btnClearHistory = document.getElementById('btnClearHistory');
	const btnUndo = document.getElementById('btnUndo');
	const btnOpenSettings = document.getElementById('btnOpenSettings');
	const settingsSheet = document.getElementById('settingsSheet');
	const btnSettingsCancel = document.getElementById('btnSettingsCancel');
	const btnSettingsSave = document.getElementById('btnSettingsSave');
	const switchNoRepeat = document.getElementById('switchNoRepeat');
	const switchAnimate = document.getElementById('switchAnimate');
	const textareaRoster = document.getElementById('textareaRoster');
	const btnToggleTheme = document.getElementById('btnToggleTheme');
	const btnAuto5s = document.getElementById('btnAuto5s');
	// 新增设置控件
	const switchShowRangeBar = document.getElementById('switchShowRangeBar');
	const rangeBar = document.getElementById('rangeBar');
	const inputAutoSeconds = document.getElementById('inputAutoSeconds');
	const autoSecondsPreview = document.getElementById('autoSecondsPreview');

	/** 状态 **/
	const STORAGE_KEY = 'rollcall:v1';
	let timerId = null;
	let isRolling = false;
	let pickedStack = []; // 历史栈（用于撤销）
	let pickedSet = new Set(); // 已抽到（用于不重复）
	let rosterMap = new Map(); // 学号 -> 姓名
	let autoSeconds = 5; // 自动抽人时长（秒）

	/** 工具函数 **/
	const clampRange = (min, max) => {
		if (!Number.isFinite(min) || !Number.isFinite(max)) return [1, 50];
		if (min > max) return [max, min];
		return [Math.floor(min), Math.floor(max)];
	};

	const parseExclude = (text) => {
		if (!text) return new Set();
		return new Set(
			text
				.split(/[^-\d]+/)
				.map((s) => s.trim())
				.filter(Boolean)
				.map((n) => Number(n))
				.filter((n) => Number.isFinite(n))
		);
	};

	const parseRoster = (raw) => {
		const map = new Map();
		if (!raw) return map;
		raw
			.split(/\n+/)
			.map((line) => line.trim())
			.filter(Boolean)
			.forEach((line) => {
				const m = line.match(/^(\-?\d+)\s+(.+)$/);
				if (m) {
					map.set(Number(m[1]), m[2].trim());
				}
			});
		return map;
	};

	const sampleInt = (min, max, excludeSet, noRepeat) => {
		const candidates = [];
		for (let i = min; i <= max; i++) {
			if (excludeSet.has(i)) continue;
			if (noRepeat && pickedSet.has(i)) continue;
			candidates.push(i);
		}
		if (candidates.length === 0) return null;
		const idx = Math.floor(Math.random() * candidates.length);
		return candidates[idx];
	};

	const renderHistory = () => {};

	const updateDisplay = (n) => {
		displayNumber.textContent = n != null ? String(n) : '—';
		const name = n != null ? rosterMap.get(n) : '';
		if (name) {
			displayName.textContent = name;
			displayName.classList.remove('hidden');
		} else {
			displayName.textContent = '—';
			displayName.classList.add('hidden');
		}
	};

	const saveState = () => {
		const state = {
			min: Number(inputMin.value),
			max: Number(inputMax.value),
			exclude: inputExclude.value,
			noRepeat: switchNoRepeat.checked,
			animate: switchAnimate.checked,
			roster: textareaRoster.value,
			picked: Array.from(pickedSet),
			history: pickedStack,
			themeDark: document.documentElement.classList.contains('theme-dark'),
			showRangeBar: switchShowRangeBar ? switchShowRangeBar.checked : true,
			autoSeconds: inputAutoSeconds ? Number(inputAutoSeconds.value) : autoSeconds,
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	};

	const loadState = () => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const s = JSON.parse(raw);
			if (Number.isFinite(s.min)) inputMin.value = s.min;
			if (Number.isFinite(s.max)) inputMax.value = s.max;
			if (typeof s.exclude === 'string') inputExclude.value = s.exclude;
			switchNoRepeat.checked = !!s.noRepeat;
			switchAnimate.checked = s.animate !== false;
			if (typeof s.roster === 'string') textareaRoster.value = s.roster;
			pickedSet = new Set(Array.isArray(s.picked) ? s.picked : []);
			pickedStack = Array.isArray(s.history) ? s.history : [];
			if (s.themeDark) {
				document.documentElement.classList.add('theme-dark');
				document.body?.setAttribute('data-weui-theme', 'dark');
			} else {
				document.body?.setAttribute('data-weui-theme', 'light');
			}

			// 新增设置：顶部范围栏显示与自动秒数
			if (switchShowRangeBar && typeof s.showRangeBar === 'boolean') {
				switchShowRangeBar.checked = s.showRangeBar;
			}
			if (typeof s.autoSeconds === 'number' && s.autoSeconds >= 1 && s.autoSeconds <= 10) {
				autoSeconds = Math.floor(s.autoSeconds);
				if (inputAutoSeconds) inputAutoSeconds.value = String(autoSeconds);
			}
		} catch (e) {
			console.warn('load state failed', e);
		}
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
	};

	const closeSettings = () => {
		settingsSheet.classList.remove('is-open');
		// 等待动画结束后再隐藏
		setTimeout(() => settingsSheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	const startRoll = () => {
		if (isRolling) return;
		const [minRaw, maxRaw] = [Number(inputMin.value), Number(inputMax.value)];
		const [min, max] = clampRange(minRaw, maxRaw);
		const excludeSet = parseExclude(inputExclude.value);
		const noRepeat = switchNoRepeat.checked;
		const canPick = sampleInt(min, max, excludeSet, noRepeat);
		if (canPick == null) {
			const hasWeuiTopTips = typeof window !== 'undefined' && window.weui && typeof window.weui.topTips === 'function';
			hasWeuiTopTips ? window.weui.topTips('可选学号为空，请检查范围/排除/不重复设置') : alert('可选学号为空，请检查范围/排除/不重复设置');
			return;
		}
		isRolling = true;
		btnStart?.classList.add('hidden');
		btnStop?.classList.remove('hidden');
		startButtons.forEach(b => b.classList.add('hidden'));
		stopButtons.forEach(b => b.classList.remove('hidden'));
		document.querySelector('.app')?.classList.toggle('rolling', switchAnimate.checked);
		const exclude = excludeSet;
		const animate = switchAnimate.checked;
		timerId = setInterval(() => {
			const n = sampleInt(min, max, exclude, false);
			updateDisplay(n);
		}, animate ? 60 : 100);
	};

	const stopRoll = () => {
		if (!isRolling) return;
		isRolling = false;
		btnStart?.classList.remove('hidden');
		btnStop?.classList.add('hidden');
		startButtons.forEach(b => b.classList.remove('hidden'));
		stopButtons.forEach(b => b.classList.add('hidden'));
		clearInterval(timerId);
		timerId = null;
		document.querySelector('.app')?.classList.remove('rolling');

		const [min, max] = clampRange(Number(inputMin.value), Number(inputMax.value));
		const excludeSet = parseExclude(inputExclude.value);
		const noRepeat = switchNoRepeat.checked;
		const n = sampleInt(min, max, excludeSet, noRepeat);
		if (n == null) {
			updateDisplay(null);
			return;
		}
		updateDisplay(n);
		displayNumber.classList.remove('pop');
		void displayNumber.offsetWidth; // 触发重绘
		displayNumber.classList.add('pop');

		// 彩带效果
		try {
			launchConfetti();
		} catch (_) {}
		if (noRepeat) pickedSet.add(n);
		const item = {
			number: n,
			name: rosterMap.get(n) || '',
			time: new Date().toLocaleString(),
		};
		pickedStack.push(item);
		renderHistory();
		saveState();
	};

	const resetAll = () => {
		pickedSet.clear();
		pickedStack = [];
		updateDisplay(null);
		renderHistory();
		saveState();
	};

	const undoLast = () => {
		const last = pickedStack.pop();
		if (!last) return;
		pickedSet.delete(last.number);
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
			versionEl.textContent = 'v1.0.0';
		}
		if (copyrightEl) {
			const year = new Date().getFullYear();
			copyrightEl.textContent = `© ${year}`;
		}
	};

	/** 事件绑定 **/
	btnStart?.addEventListener('click', startRoll);
	btnStop?.addEventListener('click', stopRoll);
	startButtons.forEach(b => b.addEventListener('click', startRoll));
	stopButtons.forEach(b => b.addEventListener('click', stopRoll));
	btnReset?.addEventListener('click', resetAll);
	// 历史已移除（保留逻辑以便将来扩展，但不渲染）
	btnOpenSettings?.addEventListener('click', openSettings);
	btnSettingsCancel?.addEventListener('click', closeSettings);
	btnSettingsSave?.addEventListener('click', () => {
		applyRoster();
		saveState();
		closeSettings();
	});
	btnToggleTheme?.addEventListener('click', toggleTheme);

	// 自动抽人（可配置 1-10 秒）
	btnAuto5s?.addEventListener('click', () => {
		if (isRolling) return;
		startRoll();
		const durationMs = (autoSeconds || 5) * 1000;
		const startTs = performance.now();
		if (displayCountdown) {
			displayCountdown.classList.remove('hidden');
			// 隐藏学号与姓名，避免重叠
			if (displayNumber) displayNumber.style.visibility = 'hidden';
			if (displayName) displayName.style.visibility = 'hidden';
		}
		const tick = () => {
			const now = performance.now();
			let remain = Math.max(0, durationMs - (now - startTs));
			// 格式：秒.毫秒（3位）
			const s = Math.floor(remain / 1000);
			const ms = Math.floor(remain % 1000);
			if (displayCountdown) displayCountdown.textContent = `${s}.${String(ms).padStart(3,'0')}`;
			if (remain > 0) {
				requestAnimationFrame(tick);
			} else {
				if (displayCountdown) displayCountdown.classList.add('hidden');
				if (displayNumber) displayNumber.style.visibility = '';
				if (displayName) displayName.style.visibility = '';
				stopRoll();
			}
		};
		requestAnimationFrame(tick);
	});

	[inputMin, inputMax, inputExclude, switchNoRepeat, switchAnimate, switchShowRangeBar, inputAutoSeconds].forEach((el) => {
		el?.addEventListener('change', () => {
			saveState();
		});
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
	});

	textareaRoster?.addEventListener('input', () => {
		// 预览姓名显示
		applyRoster();
	});

	// 初始化
	loadState();
	applyRoster();
	renderHistory();
	const last = pickedStack[pickedStack.length - 1];
	updateDisplay(last ? last.number : null);
	setFooterInfo();
	// 应用新增设置的初始状态
	applyRangeBarVisible();
	updateAutoSecondsUI();
	// 初始化滑条背景
	if (inputAutoSeconds) {
		const p = (Number(inputAutoSeconds.value) - 1) / 9 * 100;
		inputAutoSeconds.style.setProperty('--_val', p + '%');
	}
})();

// 简易彩带实现（无第三方库）
function launchConfetti() {
	const DURATION = 1600;
	const COUNT = 28;
	const end = Date.now() + DURATION;
	const colors = ['#34d399','#10b981','#22c55e','#f59e0b','#ef4444','#3b82f6'];
	const container = document.body;
	for (let i = 0; i < COUNT; i++) {
		const conf = document.createElement('i');
		conf.style.position = 'fixed';
		conf.style.top = '-12px';
		conf.style.left = (Math.random() * 100) + 'vw';
		conf.style.width = '8px';
		conf.style.height = 12 + Math.random() * 10 + 'px';
		conf.style.background = colors[i % colors.length];
		conf.style.opacity = '0.9';
		conf.style.transform = `rotate(${Math.random()*360}deg)`;
		conf.style.pointerEvents = 'none';
		conf.style.borderRadius = '2px';
		container.appendChild(conf);
		const translateY = window.innerHeight + 40 + Math.random() * 120;
		const translateX = (Math.random() * 2 - 1) * 120;
		conf.animate([
			{ transform: `translate(0, 0) rotate(0deg)` },
			{ transform: `translate(${translateX}px, ${translateY}px) rotate(${720*Math.random()}deg)` }
		], { duration: DURATION + Math.random()*600, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
		setTimeout(() => conf.remove(), DURATION + 800);
	}
}


