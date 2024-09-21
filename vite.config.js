import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig, normalizePath } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const ROOT_DIR = './src'
const ASSETS_DIR = 'assets'
const BUILD_DIR = 'build'
const PUBLIC_DIR = `${ROOT_DIR}/${ASSETS_DIR}`

const entries = getEntries()
const input = getInput(entries)
generateIndexPage(entries)

export default defineConfig({
	base: './',
	root: ROOT_DIR,
	publicDir: PUBLIC_DIR,
	plugins: [
		pug({
			root: ROOT_DIR,
			data: path.resolve(import.meta.dirname, `${ROOT_DIR}/data/*.json`),
			options: {
				pretty: true,
			},
		}),
		viteStaticCopy({
			targets: [
				{
					src: normalizePath(path.resolve(import.meta.dirname, PUBLIC_DIR)),
					dest: '',
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
		assetsDir: ASSETS_DIR,
		assetsInlineLimit: 0,
		copyPublicDir: true,
		cssCodeSplit: true,
		cssMinify: 'lightningcss',
		emptyOutDir: true,
		modulePreload: false,
		outDir: `../${BUILD_DIR}`,
		target: 'modules',
		rollupOptions: {
			input,
			output: {
				dir: `./${BUILD_DIR}`,
				chunkFileNames: `${ASSETS_DIR}/js/[name].js`,

				entryFileNames: chunk => {
					const name = chunk.name.replace(/\.pug$/, '')

					return `${ASSETS_DIR}/js/${name}.js`
				},

				assetFileNames: chunk => {
					const extname = path.extname(chunk.name)
					let type

					if (['.css'].includes(extname)) type = 'css'
					if (['.woff', '.woff2'].includes(extname)) type = 'fonts'

					return [ASSETS_DIR, type, chunk.name].filter(Boolean).join('/')
				},
			},
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, ROOT_DIR),
			'@@': path.resolve(import.meta.dirname, './node_modules'),
		},
	},
	server: {
		host: true,
	},
})

function getEntries() {
	return fs.readdirSync(path.resolve(import.meta.dirname, ROOT_DIR)).filter(file => file.endsWith('.pug'))
}

function getInput(entries) {
	return entries.map(tpl => `${ROOT_DIR}/${tpl}.html`)
}

function generateIndexPage(entries) {
	const INDEX_PAGE = 'index.pug'
	const templates = entries.filter(tpl => tpl !== INDEX_PAGE).entries()

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
		html += `\t\t\tli: a(href="${name}.html") ${index < 9 ? '0' : ''}${index + 1}. ${name}\n`
	}

	fs.writeFileSync(`${ROOT_DIR}/${INDEX_PAGE}`, html)
}
