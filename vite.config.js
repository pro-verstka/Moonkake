import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import { defineConfig } from 'vite'

const ROOT_DIR = './src'
const PUBLIC_DIR = 'assets'

const getEntries = () => {
	return fs
		.readdirSync(path.resolve(__dirname, ROOT_DIR))
		.filter(f => f.endsWith('.pug'))
		.map(tpl => `${ROOT_DIR}/${tpl}.html`)
}

export default defineConfig({
	base: './',
	root: ROOT_DIR,
	publicDir: `${ROOT_DIR}/${PUBLIC_DIR}`,
	plugins: [pug({
		root: ROOT_DIR,
		data: path.resolve(__dirname, `${ROOT_DIR}/data/*.json`),
		options: {
			pretty: true
		}
	})],
	build: {
		target: 'modules',
		assetsDir: PUBLIC_DIR,
		outDir: '../dist',
		emptyOutDir: true,
		cssMinify: 'lightningcss',
		rollupOptions: {
			input: getEntries(),
			output: {
				dir: './dist',
				entryFileNames: (chunk) => {
					const name = chunk.name.replace(/\.pug$/, '')

					return `${PUBLIC_DIR}/js/${name}.js`
				},
				chunkFileNames: `${PUBLIC_DIR}/js/[name].js`,
				assetFileNames: (chunk) => {
					const extname = path.extname(chunk.name)

					if (['.css'].includes(extname)) {
						return `${PUBLIC_DIR}/css/${chunk.name}`
					}

					if (['.woff', '.woff2'].includes(extname)) {
						return `${PUBLIC_DIR}/fonts/${chunk.name}`
					}

					return `${PUBLIC_DIR}/media/${chunk.name}`
				}
			}
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, ROOT_DIR),
			'@@': path.resolve(__dirname, './node_modules'),
		}
	},
})
