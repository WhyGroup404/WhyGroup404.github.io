
(function (window) {
	'use strict';

	// 智慧统计：错题提升强度（可按需调整）
	const SMART_WRONG_ALPHA = 1.8;

	const getMonthKey = (ts = Date.now()) => {
		const d = new Date(ts);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	};

	/**
	 * 内部：根据当前配置计算候选与对应权重（不做随机抽取）
	 * 返回 { candidates:number[], weights:number[] }
	 */
	function computeWeights(options) {
		const {
			min,
			max,
			excludeSet,
			noRepeat,
			isRolling,
			weightsEnabled,
			weightsMaskEnabled,
			weightMap,
			balancedEnabled,
			lastPickedAtMap,
			balancedBoostMax,
			smartStatsEnabled,
			smartStats,
			smartStatsDecayEnabled = true,
			alphaOverride,
			correctDecayOverride,
			pickedSet,
			weightsIgnoreNoRepeat,
			rand = Math.random,
			decayMinOverride,
		} = options || {};

		const candidates = [];
		let hasPositiveWeightInRange = false;
		for (let i = min; i <= max; i++) {
			if (excludeSet && excludeSet.has(i)) continue;
			if (Number(weightMap && weightMap.get(i)) > 0) hasPositiveWeightInRange = true;
		}
		for (let i = min; i <= max; i++) {
			if (excludeSet && excludeSet.has(i)) continue;
			if (noRepeat && pickedSet && pickedSet.has(i)) {
				const isWeightedPositive = Number(weightMap && weightMap.get(i)) > 0;
				const ignoreNR = !!(noRepeat && weightsIgnoreNoRepeat && weightsEnabled && hasPositiveWeightInRange && isWeightedPositive);
				if (!ignoreNR) continue;
			}
			candidates.push(i);
		}
		if (candidates.length === 0) return { candidates, weights: [] };

		// 是否需要加权（智慧统计也视为一种加权）。滚动且掩盖时，使用等权重。
		const useWeighted = (!!weightsEnabled || !!balancedEnabled || !!smartStatsEnabled) && !(weightsMaskEnabled && isRolling);
		if (!useWeighted) {
			return { candidates, weights: new Array(candidates.length).fill(1) };
		}

		const weights = new Array(candidates.length).fill(0);
		let assignedTotal = 0;
		let unsetCount = 0;
		if (weightsEnabled && weightMap) {
			for (let i = 0; i < candidates.length; i++) {
				const n = candidates[i];
				const p = Number(weightMap.get(n)) || 0;
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
				for (let i = 0; i < candidates.length; i++) if (weights[i] === 0) weights[i] = avg;
			}
		} else {
			for (let i = 0; i < candidates.length; i++) weights[i] = 1;
		}

		// 均衡加成
		if (balancedEnabled && lastPickedAtMap) {
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
			for (let i = 0; i < ages.length; i++) if (!Number.isFinite(ages[i])) ages[i] = notPickedAge;
			minAge = Math.min(minAge, notPickedAge);
			maxAge = Math.max(maxAge, notPickedAge);
			const span = Math.max(1, maxAge - minAge);
			const maxBoost = Math.min(3, Math.max(1, Number(balancedBoostMax) || 2));
			for (let i = 0; i < candidates.length; i++) {
				const normalized = (ages[i] - minAge) / span;
				const boost = 1 + normalized * (maxBoost - 1);
				weights[i] = Math.max(0, weights[i]) * boost;
			}
		}

		// 智慧统计加成/下降
		if (smartStatsEnabled && smartStats) {
			try {
				const mk = getMonthKey();
				const data = smartStats[mk] || {};
				for (let i = 0; i < candidates.length; i++) {
					const id = candidates[i];
					const rec = data[id];
					if (rec && (rec.wrong > 0 || rec.correct > 0)) {
						const ALPHA = (typeof alphaOverride === 'number' && alphaOverride >= 0) ? alphaOverride : SMART_WRONG_ALPHA;
						const wrongPart = ALPHA * (rec.wrong || 0) / (1 + (rec.correct || 0));
						const decayMax = (typeof correctDecayOverride === 'number' && correctDecayOverride >= 0 && correctDecayOverride <= 1) ? correctDecayOverride : 0.8;
						const correctPart = smartStatsDecayEnabled ? (rec.correct > 0 ? -Math.min(decayMax, (rec.correct / (rec.picked || 1)) * decayMax) : 0) : 0;
						const raw = 1 + wrongPart + correctPart;
						// 允许下降到 [decayMin, 3]；若未启用下降，最小仍为 1
						const decayMin = (typeof decayMinOverride === 'number' && decayMinOverride >= 0 && decayMinOverride <= 1) ? decayMinOverride : 0.4;
						const minBoost = smartStatsDecayEnabled ? decayMin : 1;
						const boost = Math.min(3, Math.max(minBoost, raw));
						weights[i] = Math.max(0, weights[i]) * boost;
					}
				}
			} catch (_) {}
		}

		return { candidates, weights };
	}

	/**
	 * 按权重/均衡/智慧统计进行抽取
	 */
    function sample(options) {
		const { candidates, weights } = computeWeights(options || {});
		if (candidates.length === 0) return null;
		let total = 0;
		for (let w of weights) total += Math.max(0, w);
		if (!(total > 0)) {
			const idx = Math.floor((options && options.rand ? options.rand() : Math.random)() * candidates.length);
			return candidates[idx];
		}
		let r = (options && options.rand ? options.rand() : Math.random)() * total;
		for (let i = 0; i < candidates.length; i++) {
			r -= Math.max(0, weights[i]);
			if (r <= 0) return candidates[i];
		}
		return candidates[candidates.length - 1];
	}

	/**
	 * 概率预览：返回每个候选学号的当前抽中概率
	 * 返回 { probMap: { [id]: number }, candidates:number[], weights:number[], total:number }
	 */
	function preview(options) {
		const { candidates, weights } = computeWeights(options || {});
		const result = { probMap: {}, candidates, weights, total: 0 };
		if (!candidates || candidates.length === 0) return result;
		let total = 0;
		for (let w of weights) total += Math.max(0, w);
		result.total = total;
		if (!(total > 0)) {
			const p = 1 / candidates.length;
			for (let i = 0; i < candidates.length; i++) result.probMap[candidates[i]] = p;
			return result;
		}
		for (let i = 0; i < candidates.length; i++) {
			result.probMap[candidates[i]] = Math.max(0, weights[i]) / total;
		}
		return result;
	}

	function record(smartStats, id, type) {
		const key = getMonthKey();
		if (!smartStats[key]) smartStats[key] = {};
		if (!smartStats[key][id]) smartStats[key][id] = { picked: 0, correct: 0, wrong: 0 };
		switch (type) {
			case 'picked': smartStats[key][id].picked++; break;
			case 'correct': smartStats[key][id].correct++; break;
			case 'wrong': smartStats[key][id].wrong++; break;
		}
		// 留空：记录由上层应用负责持久化
	}

	window.Probability = { sample, preview, record, getMonthKey, SMART_WRONG_ALPHA };
})(window);


