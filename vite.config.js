import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig } from 'vite'

const ROOT_DIR = './src'
const PUBLIC_DIR = 'assets'

const getEntries = () => {
	return fs
		.readdirSync(path.resolve(import.meta.dirname, ROOT_DIR))
		.filter(file => file.endsWith('.pug'))
}

const getInput = entries => {
	return entries.map(tpl => `${ROOT_DIR}/${tpl}.html`)
}

const generateIndexPage = entries => {
	const INDEX_PAGE = 'index.pug'
	let content = `doctype html\nhtml(lang="ru")\n\thead\n\t\tmeta(charset="utf-8")\n\t\tstyle.
			* {margin: 0; padding: 0; font-size: 1.2rem; font-family: Arial, Helvetica, sans-serif; font-variant-numeric: tabular-nums;} body {background:#fafafa;} a {padding: 1rem 1.2rem; display: block; color: #4846FE; text-decoration: none; border-bottom: 1px solid #f0f0f0; text-transform: capitalize;} a:visited {color: #333;} a:hover {background: #4846FE; color: #fff;}\n\tbody\n\t\tul`

	const templates = entries.filter(tpl => tpl !== INDEX_PAGE).entries()

	for (const [index, tpl] of templates) {
		const [name] = tpl.split('.')
		content += `\n\t\t\tli: a(href="${name}.html") ${
			index < 10 ? `0${index + 1}` : index + 1
		}. ${name}`
	}

	fs.writeFileSync(`${ROOT_DIR}/${INDEX_PAGE}`, content)
}

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
		target: 'modules',
		assetsDir: PUBLIC_DIR,
		outDir: '../dist',
		emptyOutDir: true,
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
})
