import {dialog, ipcMain} from 'electron';
import os from 'os';
import fs from 'fs';
import path from 'path';
import webp from 'webp-converter';
import fsExtra from 'fs-extra';

let forEach, win_webp;

(async () => {
	forEach = (await import('lodash-es')).default.forEach;
	win_webp = (await import('./win-webpmux-animate')).default.win_webp;
})();

let outputDirectory = `${os.homedir()}/Desktop/webp`;

let destination = '';

let quality = '80';

let animated = false;

let loop = 0;

let fps = 30;

ipcMain.handle('webp-open-directory', async () => {
	const {canceled, filePaths} = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});

	outputDirectory = canceled ? outputDirectory : filePaths[0];

	return outputDirectory;
});

ipcMain.handle('webp-update-level', (e, payload) => {
	quality = payload;
});

ipcMain.handle('webp-update-animated', (e, payload) => {
	animated = payload;
});

ipcMain.handle('webp-update-loop', (e, payload) => {
	loop = payload ? 0 : 1;
});

ipcMain.handle('webp-update-fps', (e, payload) => {
	fps = payload;
});

ipcMain.handle('webp', async (e, payload) => {
	const data = JSON.parse(payload);

	const destinationByOs = path => /^win/.test(process.platform) ? path.replace(/\\/g, '/') : path;

	destination = destinationByOs(`${outputDirectory}${data.subPath ? data.subPath : ''}`);

	fsExtra.ensureDirSync(destination);

	const toPath = `${destination}/${data.name}`.replace(path.extname(data.path), '.webp');

	await webp.cwebp(data.path, toPath, `-q ${quality}`);

	const fromStats = fs.statSync(data.path);
	const toStats = fs.statSync(toPath);

	return {
		uniqId: data.uniqId,
		from: {
			path: data.path,
			size: fromStats.size
		},
		to: {
			path: toPath,
			size: toStats.size
		}
	};
});

const detectFiles = (folder) => {
	const findList = fs.readdirSync(folder, {withFileTypes: true});

	const files = findList.filter(findItem => findItem.isFile())
		.map(findItem => findItem.name);

	return files.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
};

const removeEndSlash = (path) => {
	return path.replace(/\/$/, '');
};

const makeInputData = (targetPath, animatedFiles) => {
	const result = [];
	const delay = Math.floor(1000 / fps);

	animatedFiles.forEach((fileName) => {
		if (!/.webp/.test(fileName)) return;

		result.push({
			path: `${removeEndSlash(targetPath)}/${fileName}`,
			offset: `+${delay}+0+0+0-b`
		});
	});

	return result;
};

ipcMain.handle('webp-animated', (e, payload) => {
	if (animated === false) return;

	let folders = JSON.parse(payload);

	if (folders.length < 1) {
		folders = [''];
	}

	forEach(folders, async (folder) => {
		const targetPath = `${outputDirectory}${folder}`;

		const animatedFiles = detectFiles(targetPath);

		if (animatedFiles.length === 0) {
			return;
		}

		const animatedData = makeInputData(targetPath, animatedFiles);

		fsExtra.ensureDirSync(path.dirname(targetPath));

		const toFile = `${targetPath}/${animatedFiles[0].replace('0.webp', 'animated.webp')}`;

		try {
			if (os.platform() === 'win32') {
				win_webp.win_webpmux_animate(targetPath, animatedData, toFile, loop, '0,255,255,255', '');
			} else {
				webp.webpmux_animate(animatedData, toFile, loop, '0,255,255,255', '');
			}
		} catch (e) {
			console.log(e);
		}
	});
});
