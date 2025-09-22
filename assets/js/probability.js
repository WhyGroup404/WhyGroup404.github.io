(function (window) {
	'use strict';

	// 智慧统计：错题提升强度（可按需调整）
	const SMART_WRONG_ALPHA = 1.8;

	const getMonthKey = (ts = Date.now()) => {
		const d = new Date(ts);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
	};

	/**
	 * 按权重/均衡/智慧统计进行抽取
	 */
    function sample(options) {
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
		if (candidates.length === 0) return null;

		// 是否需要加权（智慧统计也视为一种加权）
		let useWeighted = !!weightsEnabled || !!balancedEnabled || !!smartStatsEnabled;
		if (!useWeighted || (weightsMaskEnabled && isRolling)) {
			const idx = Math.floor(rand() * candidates.length);
			return candidates[idx];
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
            // 未启用显式权重时，给所有候选一个均等的基础权重，
            // 便于均衡/智慧统计在此基础上产生“相对差异”。
            for (let i = 0; i < candidates.length; i++) weights[i] = 1;
        }

		// 均衡加成（久未被抽到）
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

		// 智慧统计加成（错得越多 → 提升更明显）
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
                        const raw = 1 + wrongPart + correctPart; // 答对多时略微下降；关闭开关则不下降
						const boost = Math.min(3, Math.max(1, raw));
						weights[i] = Math.max(0, weights[i]) * boost;
					}
				}
			} catch (_) {}
		}

		let total = 0;
		for (let w of weights) total += Math.max(0, w);
		if (!(total > 0)) {
			const idx = Math.floor(rand() * candidates.length);
			return candidates[idx];
		}
		let r = rand() * total;
		for (let i = 0; i < candidates.length; i++) {
			r -= Math.max(0, weights[i]);
			if (r <= 0) return candidates[i];
		}
		return candidates[candidates.length - 1];
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
		try { localStorage.setItem((window.getMetaKey ? window.getMetaKey('') : '') + ''); } catch (_) {}
	}

	window.Probability = { sample, record, getMonthKey, SMART_WRONG_ALPHA };
})(window);


