const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const parseSassToObject = require('./modules/parseSassToObject')

const isDev = process.env.NODE_ENV === 'development'

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
		templates.push(
			new HtmlWebpackPlugin({
				filename: `${key}.html`,
				template: path.resolve(__dirname, `src/templates/${key}.pug`),
				chunks: ['app', key],
				inject: 'body',
				scriptLoading: 'module'
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

module.exports = {
	// target: isDev ? "web" : "browserslist",

	entry: {
		app: ['./src/js/app.js', `./src/css/app.${config.stylesExtension}`],
		...getEntries()
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
								require,
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
		runtimeChunk: isDev ? 'single' : false,
		minimize: !isDev,
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
		new ESLintPlugin()
	],

	stats: 'errors-only',

	devServer: {
		hot: true
	}
}
