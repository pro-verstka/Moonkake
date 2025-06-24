import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import twig from '@vituum/vite-plugin-twig'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import packageJson from './package.json'

const config = {
	base: path.relative(import.meta.dirname, './'),
	root: path.relative(import.meta.dirname, './src'),
	dist: path.resolve(import.meta.dirname, './build'),
	public: path.resolve(import.meta.dirname, './public'),

	templateEngine: 'pug',
	get indexPageName() {
		return `index.${this.templateEngine}`
	},

	assets: {
		styles: {
			dir: 'styles',
			ext: ['.css'],
		},
		fonts: {
			dir: 'fonts',
			ext: ['.woff', '.woff2'],
		},
		scripts: {
			dir: 'scripts',
		},
		media: {
			dir: 'media',
		},
	},
}

const utils = {
	withAssets: url => path.relative(import.meta.dirname, `assets/${url}`),
	withStyles: url => path.resolve(config.root, `${config.assets.styles.dir}/${url}`),
	withScripts: url => path.resolve(config.root, `${config.assets.scripts.dir}/${url}`),
}

const entries = getEntries()
const input = getInput(entries)
generateIndexPage(entries)

export default defineConfig({
	base: config.base,
	root: config.root,
	publicDir: config.public,
	plugins: [
		checker({
			biome: {
				command: 'check',
			},
		}),
		pug({
			root: config.root,
			data: path.resolve(config.root, 'data/*.json'),
			options: {
				pretty: true,
			},
		}),
		twig({
			root: config.root,
			data: path.resolve(config.root, 'data/*.json'),
		}),
		viteStaticCopy({
			silent: true,
			structured: false,
			targets: [
				{
					src: path.resolve(config.public, '*'),
					dest: config.dist,
				},
			],
		}),
	],
	css: {
		transformer: 'lightningcss',
	},
	build: {
		appType: 'mpa',
		assetsInlineLimit: 0,
		copyPublicDir: false,
		cssCodeSplit: true,
		emptyOutDir: true,
		modulePreload: false,
		outDir: config.dist,
		rollupOptions: {
			input,
			output: {
				dir: config.dist,
				chunkFileNames: utils.withAssets(`${config.assets.scripts.dir}/[name].js`),

				entryFileNames: chunk => {
					const name = chunk.name.replace(/\.(pug|twig)$/, '')

					return utils.withAssets(`${config.assets.scripts.dir}/${name}.js`)
				},

				assetFileNames: chunk => {
					const pathToChunk = [config.assets.media.dir, chunk.name]

					for (const asset of Object.values(config.assets)) {
						if (!asset.ext || !asset.ext.length) {
							continue
						}

						if (asset.ext.includes(path.extname(chunk.name))) {
							pathToChunk[0] = asset.dir
						}
					}

					return utils.withAssets(pathToChunk.filter(Boolean).join('/'))
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(config.root),
			'@@': path.resolve(import.meta.dirname, './node_modules'),

			_styles: utils.withStyles(''),
			_components: utils.withStyles('components'),
			_config: utils.withStyles('config'),
			_mixins: utils.withStyles('mixins'),
			_utils: utils.withStyles('utils'),
			_vendors: utils.withStyles('vendors'),
			_widgets: utils.withStyles('widgets'),
			_pages: utils.withStyles('pages'),

			$scripts: utils.withScripts(''),
			$components: utils.withScripts('components'),
			$config: utils.withScripts('config'),
			$helpers: utils.withScripts('helpers'),
			$utils: utils.withScripts('utils'),
			$pages: utils.withScripts('pages'),
		},
	},
	server: {
		host: true,
	},
	define: {
		__APP_INFO__: {
			name: packageJson.name,
			homepage: packageJson.homepage,
			version: packageJson.version,
			author: packageJson.author,
		},
	},
})

function getEntries() {
	return fs.readdirSync(config.root).filter(file => file.endsWith('.pug') || file.endsWith('.twig'))
}

function getInput(entries) {
	return entries.map(tpl => path.resolve(config.root, `${tpl}.html`))
}

function generateIndexPage(entries) {
	const htmlTemplate = {
		pug: generatePugTemplate,
		twig: generateTwigTemplate,
	}

	const templates = entries.filter(tpl => tpl !== config.indexPageName).entries()
	const html = htmlTemplate[config.templateEngine](templates)

	fs.writeFileSync(path.resolve(config.root, config.indexPageName), html)
}

function generatePugTemplate(templates) {
	let html = `doctype html
html(lang="en")
	head
		meta(charset="utf-8")
		meta(name="viewport" content="width=device-width,initial-scale=1")
		style.
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
	body
		ul
`

	for (const [index, tpl] of templates) {
		const [name] = tpl.split('.')
		html += `\t\t\tli: a(href="${name}.html") ${String(index + 1).padStart(2, '0')}. ${name}\n`
	}

	return html
}

function generateTwigTemplate(templates) {
	let html = `<!DOCTYPE html>
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
		<ul>
`

	for (const [index, tpl] of templates) {
		const [name] = tpl.split('.')
		html += `\t\t\t<li><a href="${name}.html">${String(index + 1).padStart(2, '0')}. ${name}</a></li>\n`
	}

	html += `\t\t</ul>
	</body>
</html>`

	return html
}
