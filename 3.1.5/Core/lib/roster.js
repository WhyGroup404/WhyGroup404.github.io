'use strict';

// 名单解析与工具（无浏览器依赖）

function parseRoster(raw) {
	const map = new Map();
	if (!raw) return map;
	String(raw)
		.replace(/[\r]+/g, '')
		.split(/\n/)
		.map((line) => line.trim())
		.filter(Boolean)
		.forEach((line) => {
			const m = line.match(/^(\-?\d+)\s+(.+)$/);
			if (m) map.set(Number(m[1]), m[2].trim());
		});
	return map;
}

function parseRosterLines(raw) {
	const lines = String(raw || '')
		.replace(/[\u3000\t]+/g, ' ')
		.replace(/[\r]+/g, '')
		.split(/\n/);
	const entries = [];
	const invalid = [];
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line) continue;
		const m = line.match(/^(\-?\d+)\s+(.+)$/);
		if (m) entries.push({ id: Math.floor(Number(m[1])), name: m[2].replace(/\s+/g, ' ').trim() });
		else invalid.push({ index: i, text: line });
	}
	return { entries, invalid };
}

const stringifyRoster = (entries) => entries.map((e) => `${e.id} ${e.name}`).join('\n');
const normalizeRoster = (raw) => stringifyRoster(parseRosterLines(raw).entries);
const sortRosterById = (raw) => {
	const { entries } = parseRosterLines(raw);
	entries.sort((a, b) => a.id - b.id || a.name.localeCompare(b.name, 'zh-Hans-CN'));
	return stringifyRoster(entries);
};
const sortRosterByName = (raw) => {
	const { entries } = parseRosterLines(raw);
	entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN', { numeric: true }) || a.id - b.id);
	return stringifyRoster(entries);
};
const dedupeRosterById = (raw) => {
	const { entries } = parseRosterLines(raw);
	const seen = new Set();
	const result = [];
	for (const e of entries) { if (!seen.has(e.id)) { seen.add(e.id); result.push(e); } }
	return stringifyRoster(result);
};
const trimRosterEmptyLines = (raw) => String(raw || '').replace(/[\r]+/g, '').split(/\n/).map((s) => s.trim()).filter(Boolean).join('\n');

module.exports = { parseRoster, parseRosterLines, normalizeRoster, sortRosterById, sortRosterByName, dedupeRosterById, trimRosterEmptyLines };


