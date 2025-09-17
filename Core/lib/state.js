'use strict';

const { getProfiles, saveProfiles, getState, saveState, getMeta, saveMeta } = require('./storage');
const { clampRange } = require('./utils');
const { parseRoster } = require('./roster');

function createDefaultState() {
	return {
		min: 1,
		max: 50,
		exclude: '',
		noRepeat: true,
		animate: true,
		roster: '',
		picked: [],
		history: [],
		themeDark: false,
		showRangeBar: true,
		autoSeconds: 5,
		weightsEnabled: false,
		weightsMaskEnabled: false,
		weightsIgnoreNoRepeat: false,
		weightRules: [], // [{ id, percent }]
	};
}

function createDefaultMeta() {
	return { noRepeatExpire: 'session', pickedSavedAt: Date.now() };
}

function loadProfilesStructure() {
	const data = getProfiles();
	if (!data.list || data.list.length === 0) {
		const id = 'default';
		data.list = [{ id, name: '默认班级' }];
		data.currentId = id;
		saveProfiles(data);
		// also init default state
		saveState(id, createDefaultState());
		saveMeta(id, createDefaultMeta());
	}
	return data;
}

function setCurrentProfile(profileId) {
	const data = getProfiles();
	if (!data.list.some(p => p.id === profileId)) throw new Error('Profile not found');
	data.currentId = profileId;
	saveProfiles(data);
	return data;
}

function getCurrentProfileId() {
	const data = loadProfilesStructure();
	return data.currentId || (data.list[0] && data.list[0].id) || 'default';
}

function listProfiles() {
	return loadProfilesStructure().list;
}

function createProfile(name, cloneFromCurrent = true) {
	const data = loadProfilesStructure();
	const id = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
	const profile = { id, name: String(name || '新建班级') };
	data.list.push(profile);
	let base = null;
	if (cloneFromCurrent) {
		const cur = getState(data.currentId);
		if (cur) base = JSON.parse(JSON.stringify(cur));
	}
	if (!base) base = createDefaultState();
	base.picked = [];
	base.history = [];
	saveState(id, base);
	saveMeta(id, createDefaultMeta());
	saveProfiles(data);
	return profile;
}

function renameProfile(profileId, newName) {
	const data = loadProfilesStructure();
	const p = data.list.find(x => x.id === profileId);
	if (!p) throw new Error('Profile not found');
	p.name = String(newName || p.name);
	saveProfiles(data);
	return p;
}

function deleteProfile(profileId) {
	const data = loadProfilesStructure();
	if (data.list.length <= 1) throw new Error('至少保留一个班级');
	const idx = data.list.findIndex(x => x.id === profileId);
	if (idx < 0) throw new Error('Profile not found');
	data.list.splice(idx, 1);
	if (data.currentId === profileId) data.currentId = data.list[0].id;
	saveProfiles(data);
	return data.currentId;
}

function loadStateAndMeta(profileId) {
	let s = getState(profileId);
	if (!s) { s = createDefaultState(); saveState(profileId, s); }
	let m = getMeta(profileId);
	if (!m) { m = createDefaultMeta(); saveMeta(profileId, m); }

	// TTL check for noRepeat
	const savedAt = Number(m.pickedSavedAt) || 0;
	const now = Date.now();
	let ttlMs = 0;
	if (m.noRepeatExpire === '40m') ttlMs = 40 * 60 * 1000;
	if (m.noRepeatExpire === '1d') ttlMs = 24 * 60 * 60 * 1000;
	if (ttlMs > 0 && savedAt > 0 && now - savedAt > ttlMs) {
		s.picked = [];
		s.history = [];
		saveState(profileId, s);
		m.pickedSavedAt = now;
		saveMeta(profileId, m);
	}
	return { state: s, meta: m };
}

function saveStateAndMeta(profileId, state, meta) {
	saveState(profileId, state);
	if (meta) saveMeta(profileId, meta);
}

function getRosterMapFromState(state) {
	return parseRoster(state.roster);
}

function validateRange(state) {
	const [a, b] = clampRange(state.min, state.max);
	if (!(a < b)) throw new Error('范围不合法：最小值需小于最大值');
	return [a, b];
}

module.exports = {
	loadProfilesStructure,
	setCurrentProfile,
	getCurrentProfileId,
	listProfiles,
	createProfile,
	renameProfile,
	deleteProfile,
	loadStateAndMeta,
	saveStateAndMeta,
	getRosterMapFromState,
	validateRange,
};


