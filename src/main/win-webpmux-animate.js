const fs = require("fs");
const webpmux = require("webp-converter/src/webpmux");
const exec = require("child_process").execFile;

module.exports.win_webpmux_animate = (targetPath, input_images, output_image, loop, bgcolor, logging = '-quiet') => {
	let files = `-frame ${input_images[0]["path"]} ${input_images[0]["offset"]}`;

	let j = input_images.length;

	for (let i = 1; i < j; i++) {
		files = `${files} -frame ${input_images[i]["path"]} ${input_images[i]["offset"]}`;
	}

	const query = `${files} -loop ${loop} -bgcolor ${bgcolor}  -o ${output_image} ${logging}`;

	return new Promise((resolve, reject) => {
		fs.writeFileSync(`${targetPath}/config.txt`, query);

		exec(`"${webpmux()}"`, [`${targetPath}/config.txt`], {shell: true}, (error, stdout, stderr) => {
			if (error) {
				console.warn(error);
			}
			resolve(stdout ? stdout : stderr);
		});
	});
};
