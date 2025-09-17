/* 通用工具函数 */
(function(){
	function clampRange(min, max){
		const parseFirstInt = (value, fallback) => {
			if (Number.isFinite(value)) return Math.floor(value);
			const s = String(value ?? '').match(/-?\d+/);
			return s ? Math.floor(Number(s[0])) : fallback;
		};
		const a = parseFirstInt(min, 1);
		const b = parseFirstInt(max, 50);
		if (!Number.isFinite(a) || !Number.isFinite(b)) return [1, 50];
		if (a > b) return [b, a];
		return [a, b];
	}

	function parseExclude(text){
		if (!text) return new Set();
		const normalized = String(text).replace(/[，、；;\s]+/g, ',').replace(/,+/g, ',');
		return new Set(
			normalized
				.split(/[^-\d]+/)
				.map((s) => s.trim())
				.filter(Boolean)
				.map((n) => Number(n))
				.filter((n) => Number.isFinite(n))
		);
	}

	window.Utils = { clampRange, parseExclude };
})();


