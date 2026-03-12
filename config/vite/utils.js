import fs from 'node:fs'
import path from 'node:path'

export function createPathUtils(config) {
	return {
		withAssets: url =>
			path.relative(config.projectRoot, path.resolve(config.projectRoot, 'assets', url)),
		withStyles: url => path.resolve(config.root, `${config.assets.styles.dir}/${url}`),
		withScripts: url => path.resolve(config.root, `${config.assets.scripts.dir}/${url}`),
	}
}

export function getEntries(root) {
	const entries = new Set()

	for (const file of fs.readdirSync(root)) {
		if (file.endsWith('.pug') || file.endsWith('.twig')) {
			entries.add(file)
			continue
		}

		if (file.endsWith('.pug.html') || file.endsWith('.twig.html')) {
			entries.add(file.replace(/\.html$/, ''))
		}
	}

	return [...entries]
}

export function getInput(root, entries) {
	return entries.map(tpl => path.resolve(root, `${tpl}.html`))
}

export function getAssetFileName(asset) {
	if (typeof asset.name === 'string' && asset.name.length > 0) {
		return asset.name
	}

	if (Array.isArray(asset.names) && typeof asset.names[0] === 'string' && asset.names[0].length > 0) {
		return asset.names[0]
	}

	if (
		Array.isArray(asset.originalFileNames) &&
		typeof asset.originalFileNames[0] === 'string' &&
		asset.originalFileNames[0].length > 0
	) {
		return path.basename(asset.originalFileNames[0])
	}

	return 'asset'
}

export function generateTemplate(templates) {
	let html = ''

	for (const [index, tpl] of templates) {
		const [name] = tpl.split('.')
		html += `<li><a href="${name}.html">${String(index + 1).padStart(2, '0')}. ${name}</a></li>`
	}

	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<style>
			* {
				margin: 0; padding: 0;
			}

			body {
				background: #fafafa;
				font-size: 1.2rem;
				font-family: Arial, Helvetica, sans-serif;
				font-variant-numeric: tabular-nums;
			}

			a {
				padding: 1rem 1.2rem;
				display: block;
				color: #4846FE;
				text-decoration: none;
				border-bottom: 1px solid #f0f0f0;
				text-transform: capitalize;
			}

			a:visited {
				color: #333;
			}

			a:hover {
				background: #4846FE;
				color: #fff;
			}
		</style>
	</head>
	<body>
		<ul>${html}</ul>
	</body>
</html>`
}
