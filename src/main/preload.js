import os from 'os';

import {contextBridge, ipcRenderer} from 'electron';


contextBridge.exposeInMainWorld('commonAPI', {
	platform: () => {
		return os.platform();
	},
});

contextBridge.exposeInMainWorld('optimizeAPI', {
	openDirectory: () => ipcRenderer.invoke('optimize-open-directory'),
	
	optimize: payload => {
		return ipcRenderer.invoke('optimize', payload);
	},
	
	updateLevel: payload => {
		return ipcRenderer.invoke('optimize-update-level', payload);
	},
	
	defaultOutputDirectory: () => {
		return `${os.homedir()}/Desktop/optimize`;
	}
});

contextBridge.exposeInMainWorld('webpAPI', {
	openDirectory: () => ipcRenderer.invoke('webp-open-directory'),
	
	webp: payload => {
		return ipcRenderer.invoke('webp', payload);
	},
	
	updateLevel: payload => {
		return ipcRenderer.invoke('webp-update-level', payload);
	},
	
	updateAnimated: payload => {
		return ipcRenderer.invoke('webp-update-animated', payload);
	},
	
	updateLoop: payload => {
		return ipcRenderer.invoke('webp-update-loop', payload);
	},
	
	updateFps: payload => {
		return ipcRenderer.invoke('webp-update-fps', payload);
	},
	
	animatedWebp: payload => {
		return ipcRenderer.invoke('webp-animated', payload);
	},
	
	defaultOutputDirectory: () => {
		return `${os.homedir()}/Desktop/webp`;
	}
});
