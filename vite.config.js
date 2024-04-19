import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig } from 'vite'

const ROOT_DIR = './src'
const PUBLIC_DIR = 'assets'

const entries = getEntries()
const input = getInput(entries)
generateIndexPage(entries)

export default defineConfig({
	base: './',
	root: ROOT_DIR,
	publicDir: `${ROOT_DIR}/${PUBLIC_DIR}`,
	plugins: [
		pug({
			root: ROOT_DIR,
			data: path.resolve(import.meta.dirname, `${ROOT_DIR}/data/*.json`),
			options: {
				pretty: true,
			},
		}),
	],
	build: {
		appType: 'mpa',
		target: 'modules',
		outDir: '../dist',
		emptyOutDir: true,
		assetsDir: PUBLIC_DIR,
		assetsInlineLimit: 0,
		cssMinify: 'lightningcss',
		rollupOptions: {
			input,
			output: {
				dir: './dist',
				chunkFileNames: `${PUBLIC_DIR}/js/[name].js`,

				entryFileNames: chunk => {
					const name = chunk.name.replace(/\.pug$/, '')

					return `${PUBLIC_DIR}/js/${name}.js`
				},

				assetFileNames: chunk => {
					const extname = path.extname(chunk.name)
					let type = 'media'

					if (['.css'].includes(extname)) type = 'css'
					if (['.woff', '.woff2'].includes(extname)) type = 'fonts'

					return `${PUBLIC_DIR}/${type}/${chunk.name}`
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
