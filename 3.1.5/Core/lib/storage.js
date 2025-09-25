'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');

function ensureDir(dirPath) {
	if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
	try {
		if (!fs.existsSync(filePath)) return fallback;
		const raw = fs.readFileSync(filePath, 'utf8');
		return JSON.parse(raw);
	} catch (_e) {
		return fallback;
	}
}

function writeJson(filePath, obj) {
	ensureDir(path.dirname(filePath));
	fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

function profilesFile() { return path.join(DATA_DIR, 'profiles.json'); }
function stateFile(profileId) { return path.join(DATA_DIR, `profile_${profileId}.json`); }
function metaFile(profileId) { return path.join(DATA_DIR, `profile_${profileId}.meta.json`); }

function getProfiles() {
	const def = { list: [], currentId: '' };
	const data = readJson(profilesFile(), def);
	if (!Array.isArray(data.list)) data.list = [];
	if (!data.currentId && data.list[0]) data.currentId = data.list[0].id;
	return data;
}

function saveProfiles(data) {
	writeJson(profilesFile(), data);
}

function getState(profileId) {
	return readJson(stateFile(profileId), null);
}

function saveState(profileId, state) {
	writeJson(stateFile(profileId), state);
}

function getMeta(profileId) {
	return readJson(metaFile(profileId), null);
}

function saveMeta(profileId, meta) {
	writeJson(metaFile(profileId), meta);
}

module.exports = {
	DATA_DIR,
	ensureDir,
	getProfiles,
	saveProfiles,
	getState,
	saveState,
	getMeta,
	saveMeta,
};


