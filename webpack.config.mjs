import fs from 'node:fs'
import path from 'node:path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import HtmlReplaceWebpackPlugin from 'html-replace-webpack-plugin'
import BeautifyHtmlWebpackPlugin from 'beautify-html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { parseSassToObject } from './modules/parseSassToObject.mjs'

const __dirname = import.meta.dirname

const IS_DEV = process.env.NODE_ENV === 'development'

const config = {
	stylesExtension: 'scss'
}

const keys = fs
	.readdirSync(path.resolve(__dirname, './src/templates/'))
	.filter(el => el.endsWith('.pug'))
	.map(fileName => fileName.split('.')[0])

const getEntries = () => {
	const entries = {}

	keys.forEach(key => {
		const entry = []

		// js
		const jsFileName = `./src/js/pages/${key}.js`

		if (fs.existsSync(jsFileName)) {
			entry.push(jsFileName)
		}

		// styles
		const styleFileName = `./src/css/pages/${key}.${config.stylesExtension}`

		if (fs.existsSync(styleFileName)) {
			entry.push(styleFileName)
		}

		// templates
		const templateFileName = `./src/templates/${key}.pug`

		if (fs.existsSync(templateFileName)) {
			entry.push(templateFileName)
		}

		entries[key] = entry
	})

	return entries
}

const getTemplates = () => {
	const templates = []

	keys.forEach(key => {
		const chunks = ['app']

		if (entries[key].some(el => el.endsWith('.js'))) {
			chunks.push(key)
		}

		templates.push(
			new HtmlWebpackPlugin({
				filename: `${key}.html`,
				template: path.resolve(__dirname, `src/templates/${key}.pug`),
				chunks,
				inject: 'body',
				scriptLoading: 'defer'
			})
		)
	})

	return templates
}

const getJSONFiles = () => {
	const jsonFiles = {}

	fs.readdirSync('./src/data').forEach(file => {
		const name = `./src/data/${file}`

		if (!fs.statSync(name).isDirectory() && path.extname(name) === '.json') {
			const key = path.basename(file, path.extname(name))
			jsonFiles[key] = JSON.parse(fs.readFileSync(name))
		}
	})

	return jsonFiles
}

const getFonts = () =>
	fs
		.readdirSync(path.resolve(__dirname, './src/fonts/'))
		.filter(el => el.endsWith('.woff2'))
		.map(fileName => `<link rel="preload" href="assets/fonts/${fileName}" as="font" type="font/woff2" crossorigin>`)
		.join('')

const entries = getEntries()

export default {
	// target: IS_DEV ? "web" : "browserslist",

	entry: {
		app: ['./src/js/app.js', `./src/css/app.${config.stylesExtension}`],
		...entries
	},

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'assets/js/[name].bundle.js',
		chunkFilename: '[name].bundle.js',
		clean: true
	},

	mode: process.env.NODE_ENV,

	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: [/node_modules\/(?!(swiper|ssr-window|dom7)\/).*/, /\.test\.jsx?$/],
				use: [
					{
						loader: 'swc-loader'
					}
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											importFrom: [
												{
													customProperties: parseSassToObject(`./src/css/config/_root.${config.stylesExtension}`)
												}
											],
											features: {
												'custom-properties': {
													disableDeprecationNotice: true
												}
											}
										}
									]
								]
							}
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								includePaths: [path.resolve(__dirname, 'node_modules')]
							}
						}
					}
				]
			},
			{
				test: /\.pug$/,
				use: [
					'html-loader',
					{
						loader: 'pug-html-loader',
						options: {
							pretty: true,
							data: {
								// require,
								...getJSONFiles()
							}
						}
					}
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/fonts/'
						}
					}
				]
			}
		]
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					enforce: true,
					chunks: 'all'
				}
			}
		},
		runtimeChunk: IS_DEV ? 'single' : false,
		removeEmptyChunks: true,
		minimize: !IS_DEV,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				extractComments: false,
				terserOptions: {
					ecma: 2021,
					module: true
				}
			}),
			new CssMinimizerPlugin()
		]
	},

	plugins: [
		...getTemplates(),
		new HtmlReplaceWebpackPlugin([
			{
				pattern: /<link href/,
				replacement: `${getFonts()}<link href`
			}
		]),
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].css',
			chunkFilename: 'assets/css/[name].chunk.css'
		}),
		new CopyPlugin({
			patterns: [{ from: './src/img/', to: 'assets/img/' }]
		}),
		new BeautifyHtmlWebpackPlugin(),
		// new ESLintPlugin(),
		{
			apply: compiler => {
				compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
					const jsKeys = fs
						.readdirSync(path.resolve(__dirname, './dist/assets/js/'))
						.filter(el => el.endsWith('.js'))
						.map(fileName => fileName.split('.')[0])

					jsKeys.forEach(jsKey => {
						if (['app', 'vendors'].includes(jsKey)) {
							return
						}

						const jsFileName = `./dist/assets/js/${jsKey}.bundle.js`

						if (!entries[jsKey]?.some(el => el.endsWith('.js'))) {
							if (fs.existsSync(jsFileName)) {
								fs.unlinkSync(jsFileName)
							}
						}
					})
				})
			}
		}
	],

	stats: 'errors-only',

	devServer: {
		hot: true
	}
}
