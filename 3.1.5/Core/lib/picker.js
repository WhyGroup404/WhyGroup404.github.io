'use strict';

// 加权随机选择逻辑，独立于浏览器

/**
 * @param {number} min
 * @param {number} max
 * @param {Set<number>} excludeSet
 * @param {boolean} noRepeat
 * @param {Set<number>} pickedSet
 * @param {Map<number, number>} weightMap  // id -> percent
 * @param {{weightsEnabled?: boolean, weightsMaskEnabled?: boolean, isRolling?: boolean, weightsIgnoreNoRepeat?: boolean}} options
 * @returns {number|null}
 */
function sampleInt(min, max, excludeSet, noRepeat, pickedSet, weightMap, options = {}) {
	const weightsEnabled = !!options.weightsEnabled;
	const weightsMaskEnabled = !!options.weightsMaskEnabled;
	const isRolling = !!options.isRolling;
	const weightsIgnoreNoRepeat = !!options.weightsIgnoreNoRepeat;

	let hasPositiveWeightInRange = false;
	for (let i = min; i <= max; i++) {
		if (excludeSet.has(i)) continue;
		if ((Number(weightMap.get(i)) || 0) > 0) { hasPositiveWeightInRange = true; break; }
	}
	const ignoreNoRepeatActive = !!(noRepeat && weightsIgnoreNoRepeat && hasPositiveWeightInRange);

	const candidates = [];
	for (let i = min; i <= max; i++) {
		if (excludeSet.has(i)) continue;
		if (noRepeat && pickedSet && pickedSet.has(i)) {
			const isWeightedPositive = (Number(weightMap.get(i)) || 0) > 0;
			if (!(ignoreNoRepeatActive && isWeightedPositive)) continue;
		}
		candidates.push(i);
	}
	if (candidates.length === 0) return null;

	let useWeighted = !!weightsEnabled;
	if (!useWeighted) {
		for (let i = 0; i < candidates.length; i++) {
			if ((Number(weightMap.get(candidates[i])) || 0) > 0) { useWeighted = true; break; }
		}
	}
	if (!useWeighted || (weightsMaskEnabled && isRolling)) {
		const idx = Math.floor(Math.random() * candidates.length);
		return candidates[idx];
	}

	const weights = new Array(candidates.length).fill(0);
	let assignedTotal = 0;
	let unsetCount = 0;
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
		for (let i = 0; i < candidates.length; i++) { if (weights[i] === 0) weights[i] = avg; }
	}
	let total = 0;
	for (let w of weights) total += Math.max(0, w);
	if (!(total > 0)) {
		const idx = Math.floor(Math.random() * candidates.length);
		return candidates[idx];
	}
	let r = Math.random() * total;
	for (let i = 0; i < candidates.length; i++) {
		r -= Math.max(0, weights[i]);
		if (r <= 0) return candidates[i];
	}
	return candidates[candidates.length - 1];
}

module.exports = { sampleInt };


