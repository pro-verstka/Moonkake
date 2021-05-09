/* CONFIG
-------------------------------------------------- */

const config = {
	separateCssToPages: true,
	separateJsToPages: true,
	appendFontsToHead: true
}

const isProd = process.env.NODE_ENV === 'production'

/* COMMON
-------------------------------------------------- */

const gulp = require('gulp')

// utils
const fs = require('fs')
const path = require('path')
const browserSync = require('browser-sync').create()
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')
const del = require('del')
const data = require('gulp-data')
const cheerio = require('gulp-cheerio')
const prettify = require('gulp-prettify')

// css
const gcmq = require('gulp-group-css-media-queries')
// const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const sass = require('gulp-sass')
const packageImporter = require('node-sass-package-importer')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')

// js
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// tpl
const pug = require('gulp-pug')

/* TASKS
-------------------------------------------------- */

/* Browser */

function browser() {
	browserSync.init({
		server: {
			baseDir: './dist',
			directory: true
		},
		notify: false,
		open: false
	})
}

/* Templates */

function templates() {
	const fontFiles = []

	if (config.appendFontsToHead) {
		fs.readdirSync('./src/fonts').forEach(file => {
			const name = `./src/fonts/${file}`

			if (!fs.statSync(name).isDirectory() && path.extname(name) === '.woff2') {
				fontFiles.push(path.basename(file, path.extname(name)))
			}
		})
	}

	return gulp
		.src(['src/templates/**/*', '!src/templates/mixins/*', '!src/templates/blocks/*', '!src/templates/layouts/*'], {
			base: '.'
		})
		.pipe(data(() => JSON.parse(fs.readFileSync('src/data.json'))))
		.pipe(pug())
		.pipe(
			cheerio({
				run($, file) {
					const name = path.basename(file.path, path.extname(file.path))
					const time = new Date().getTime()
					const $css = $('[data-app-css]')
					const $js = $('[data-app-js]')

					if (fs.existsSync(`./src/css/pages/${name}.sass`) && config.separateCssToPages) {
						$css.after(`<link rel="stylesheet" href="assets/css/${name}.min.css?v=${time}">`)
					}

					if (fs.existsSync(`./src/js/pages/${name}.js`) && config.separateJsToPages) {
						$js.after(`<script defer src="assets/js/${name}.min.js?v=${time}"></script>`)
					}

					$css.removeAttr('data-app-css')
					$js.removeAttr('data-app-js')

					if (config.appendFontsToHead) {
						fontFiles.forEach(filename => {
							$('[rel="stylesheet"]')
								.eq(0)
								.before(
									`<link rel="preload" href="assets/fonts/${filename}.woff2" as="font" type="font/woff2" crossorigin>`
								)
						})
					}
				},
				parserOptions: {
					decodeEntities: false
				}
			})
		)
		.pipe(
			prettify({
				indent_size: 2,
				indent_with_tabs: true,
				indent_inner_html: true
			})
		)
		.pipe(flatten())
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream())
	// .on('end', done)
}

/* Styles */

function styles() {
	const src = []

	fs.readdirSync('./src/css').forEach(file => {
		const name = `./src/css/${file}`

		if (!fs.statSync(name).isDirectory() && path.extname(name) === '.sass') {
			src.push(name)
		}
	})

	if (config.separateCssToPages) {
		fs.readdirSync('./src/css/pages').forEach(file => {
			const name = `./src/css/pages/${file}`

			if (!fs.statSync(name).isDirectory() && path.extname(name) === '.sass') {
				src.push(name)
			}
		})
	}

	const plugins = [
		postcssPresetEnv({
			autoprefixer: {
				grid: true
			}
		})
	]

	if (isProd) {
		plugins.push(
			cssnano({
				preset: ['default', {
					zindex: false
				}]
			})
		)
	}

	return gulp
		.src(src, {
			base: '.'
		})
		.pipe(
			sass({
				includePaths: ['node_modules'],
				importer: packageImporter()
			})
		)
		.pipe(gcmq())
		.pipe(postcss(plugins))
		.pipe(flatten())
		.pipe(
			rename({
				suffix: '.min'
			})
		)
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(browserSync.stream())
}

/* Fonts */

function fonts() {
	return gulp
		.src('src/fonts/**/*', {
			base: './src/fonts/'
		})
		.pipe(gulp.dest('dist/assets/fonts/'))
		.on('end', () => {
			browserSync.reload()
		})
}

/* Images */

function images() {
	return gulp
		.src('src/img/**/*', {
			base: './src/img/'
		})
		.pipe(gulp.dest('dist/assets/img/'))
		.on('end', () => {
			browserSync.reload()
		})
}

/* Scripts */

const webpackConfig = {
	mode: isProd ? 'production' : 'development',
	entry: {},
	output: {
		filename: '[name].min.js'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.jsx?$/],
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'vue-loader'
					}
				]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'vue-style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			}
		]
	},
	externals: {
		jquery: 'jQuery'
	},
	resolve: {
		extensions: ['.js', '.json']
	},
	optimization: {
		minimize: isProd,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				extractComments: false,
				terserOptions: {
					ecma: 5
				}
			})
		]
	},
	plugins: [new VueLoaderPlugin()]
}

function scripts() {
	fs.readdirSync('./src/js').forEach(file => {
		const name = `./src/js/${file}`

		if (!fs.statSync(name).isDirectory() && ['.js'].includes(path.extname(name))) {
			const filename = path.basename(name, path.extname(name))
			webpackConfig.entry[filename] = name
		}
	})

	if (config.separateJsToPages) {
		fs.readdirSync('./src/js/pages').forEach(file => {
			const name = `./src/js/pages/${file}`

			if (!fs.statSync(name).isDirectory() && ['.js'].includes(path.extname(name))) {
				const filename = path.basename(name, path.extname(name))
				webpackConfig.entry[filename] = name
			}
		})
	}

	if (!isProd) {
		webpackConfig.devtool = 'cheap-source-map'
	}

	return gulp
		.src(Object.values(webpackConfig.entry))
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest('dist/assets/js/'))
		.pipe(browserSync.stream())
}

/* Clean */

function clean() {
	return del(['./dist/*'])
}

/* Common */

function watch() {
	gulp.watch(['src/css/**/*'], styles)
	gulp.watch(['src/js/**/*'], scripts)
	gulp.watch(['src/fonts/**/*'], fonts)
	gulp.watch(['src/img/**/*'], images)
	gulp.watch(['src/templates/**/*', 'src/img/**/*.svg', 'src/data.json'], templates)
}

exports.images = images
exports.fonts = fonts
exports.scripts = scripts
exports.styles = styles
exports.build = gulp.series(clean, gulp.parallel(fonts, images, styles, scripts), templates)
exports.default = gulp.parallel(browser, watch)
