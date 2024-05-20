import {dialog, ipcMain} from 'electron';
import os from 'os';
import fs from 'fs';

let imagemin, jpgmin, pngmin;

(async () => {
	imagemin = (await import('imagemin')).default;
	jpgmin = (await import('imagemin-jpeg-recompress')).default;
	pngmin = (await import('imagemin-pngquant')).default;
})();

let outputDirectory = `${os.homedir()}/Desktop/optimize`;

const quality = {
	jpg: '80',
	png: '80'
};

ipcMain.handle('optimize-open-directory', async () => {
	const {canceled, filePaths} = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	
	outputDirectory = canceled ? outputDirectory : filePaths[0];
	
	return outputDirectory;
});

ipcMain.handle('optimize-update-level', (e, payload) => {
	const data = JSON.parse(payload);
	
	quality[data.type] = data.value;
});

ipcMain.handle('optimize', async (e, payload) => {
	const data = JSON.parse(payload);
	
	const destinationByOs = path => /^win/.test(process.platform) ? path.replace(/\\/g, '/') : path;
	
	const result = await imagemin([destinationByOs(data.path)], {
		destination: destinationByOs(`${outputDirectory}${data.subPath ? data.subPath : ''}`),
		plugins: [
			jpgmin({
				max: quality.jpg
			}),
			pngmin({
				strip: true,
				quality: [0, quality.png / 100]
			})
		]
	});
	
	const fromStats = fs.statSync(data.path);
	const toStats = fs.statSync(result[0].destinationPath);
	
	return {
		uniqId: data.uniqId,
		from: {
			path: data.path,
			size: fromStats.size
		},
		to: {
			path: result[0].destinationPath,
			size: toStats.size
		}
	};
});
