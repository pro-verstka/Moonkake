import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const config = {
	base: path.relative(import.meta.dirname, './'),
	root: path.relative(import.meta.dirname, './src'),
	dist: path.resolve(import.meta.dirname, './build'),
	public: path.resolve(import.meta.dirname, './public'),
	withAssets: url => path.relative(import.meta.dirname, `assets/${url}`),

	indexPageName: 'index.pug',

	assets: {
		styles: {
			dir: 'styles',
			ext: ['.css']
		},
		fonts: {
			dir: 'fonts',
			ext: ['.woff', '.woff2']
		},
		scripts: {
			dir: 'scripts',
		},
		media: {
			dir: 'media',
		}
	},
}

const entries = getEntries()
const input = getInput(entries)
generateIndexPage(entries)

export default defineConfig({
	base: config.base,
	root: config.root,
	publicDir: config.public,
	plugins: [
		pug({
			root: config.root,
			data: path.resolve(config.root, 'data/*.json'),
			options: {
				pretty: true,
			},
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
		preprocessorOptions: {
			scss: {
				api: 'modern',
			},
		},
	},
	build: {
		appType: 'mpa',
		assetsInlineLimit: 0,
		copyPublicDir: false,
		cssCodeSplit: true,
		cssMinify: 'lightningcss',
		emptyOutDir: true,
		modulePreload: false,
		outDir: config.dist,
		target: 'modules',
		rollupOptions: {
			input,
			output: {
				dir: config.dist,
				chunkFileNames: config.withAssets(`${config.assets.scripts.dir}/[name].js`),

				entryFileNames: chunk => {
					const name = chunk.name.replace(/\.pug$/, '')

					return config.withAssets(`${config.assets.scripts.dir}/${name}.js`)
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

					return config.withAssets(pathToChunk.filter(Boolean).join('/'))
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(config.root),
			'@@': path.resolve(import.meta.dirname, './node_modules'),
		},
	},
	server: {
		host: true,
	},
})

function getEntries() {
	return fs.readdirSync(config.root).filter(file => file.endsWith('.pug'))
}

function getInput(entries) {
	return entries.map(tpl => path.resolve(config.root, `${tpl}.html`))
}

function generateIndexPage(entries) {
	const templates = entries.filter(tpl => tpl !== config.indexPageName).entries()

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

	fs.writeFileSync(path.resolve(config.root, config.indexPageName), html)
}
