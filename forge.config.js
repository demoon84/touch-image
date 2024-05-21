const {FusesPlugin} = require('@electron-forge/plugin-fuses');
const {FuseV1Options, FuseVersion} = require('@electron/fuses');
const path = require("path");


module.exports = {
	packagerConfig: {
		asar: false,
		icon: path.join(__dirname, 'src/assets/icons/app')
	},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				setupIcon: path.join(__dirname, 'src/assets/icons/app.ico'),
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
			config: {
				icon: path.join(__dirname, 'src/assets/icons/app.icns'),
			},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {
				icon: path.join(__dirname, 'src/assets/icons/app-256x256.png'),  // Linux 아이콘
			},
		},
		{
			name: '@electron-forge/maker-rpm',
			config: {
				icon: path.join(__dirname, 'src/assets/icons/app-256x256.png'),  // Linux 아이콘
			},
		},
	],
	publishers: [
		{
			"name": "@electron-forge/publisher-github",
			"config": {
				"repository": {
					"owner": "demoon84",
					"name": "touch-image"
				},
				"prerelease": false,
				"draft": true,
				"authToken": "${process.env.GITHUB_TOKEN}"
			}
		}
	],
	plugins: [
		{
			name: '@electron-forge/plugin-vite',
			config: {
				// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
				// If you are familiar with Vite configuration, it will look really familiar.
				build: [
					{
						// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
						entry: 'src/main/index.js',
						config: 'vite.main.config.mjs',
					},
					{
						entry: 'src/main/preload.js',
						config: 'vite.preload.config.mjs',
					},
				],
				renderer: [
					{
						name: 'main_window',
						config: 'vite.renderer.config.mjs',
					},
				],
			},
		},
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: false,
		}),
	],
};
