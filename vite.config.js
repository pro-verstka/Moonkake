import path from 'node:path'
import { defineConfig } from 'vite'
import { createAsciiBannerPlugin } from './config/vite/asciiBanner.plugin.js'
import { getAssetFileName } from './config/vite/assetFileName.util.js'
import { createCheckerPlugin } from './config/vite/checker.plugin.js'
import { createCheckReservedIndexPlugin } from './config/vite/checkReservedIndex.plugin.js'
import { getEntries, getInput } from './config/vite/entries.util.js'
import { createGenerateIndexHtmlPlugin } from './config/vite/generateIndexHtml.plugin.js'
import { createPathUtils } from './config/vite/pathUtils.util.js'
import { createPublicAssetsMediaPlugin } from './config/vite/publicAssetsMedia.plugin.js'
import { createPugPlugin } from './config/vite/pug.plugin.js'
import { createTwigPlugin } from './config/vite/twig.plugin.js'
import packageJson from './package.json'

const config = {
	projectRoot: import.meta.dirname,
	base: path.relative(import.meta.dirname, './'),
	root: path.relative(import.meta.dirname, './src'),
	dist: path.resolve(import.meta.dirname, './build'),
	public: path.resolve(import.meta.dirname, './public'),

	/**
	 * Available options 'pug' and 'twig'
	 */
	templateEngine: 'pug',
	indexPageName: 'index.html',

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

const utils = createPathUtils(config)

const entries = getEntries(config.root)
const input = getInput(config.root, entries)

export default defineConfig({
	base: config.base,
	root: config.root,
	publicDir: false,
	plugins: [
		createPublicAssetsMediaPlugin(config),
		createCheckReservedIndexPlugin(config),
		createCheckerPlugin(),
		createPugPlugin(config),
		createTwigPlugin(config),
		createAsciiBannerPlugin(packageJson),
		createGenerateIndexHtmlPlugin({ config, entries }),
	],
	css: {
		lightningcss: {
			errorRecovery: true,
		},
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

				assetFileNames: asset => {
					const fileName = getAssetFileName(asset)
					const pathToAsset = [config.assets.media.dir, fileName]

					for (const output of Object.values(config.assets)) {
						if (!output.ext?.length) {
							continue
						}

						if (output.ext.includes(path.extname(fileName))) {
							pathToAsset[0] = output.dir
						}
					}

					return utils.withAssets(pathToAsset.filter(Boolean).join('/'))
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
