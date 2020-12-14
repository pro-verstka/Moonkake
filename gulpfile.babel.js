/* CONFIG
-------------------------------------------------- */

const config = {
	separateCssToPages: true,
	separateJsToPages: true,
	appendFontsToHead: true
}

/* COMMON
-------------------------------------------------- */

const gulp = require('gulp')

// utils
const fs = require('fs')
const path = require('path')
const notify = require('gulp-notify')
const browserSync = require('browser-sync')
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')
const del = require('del')
const data = require('gulp-data')
const cheerio = require('gulp-cheerio')
const prettify = require('gulp-prettify')

// css
const gcmq = require('gulp-group-css-media-queries')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const sass = require('gulp-sass')
const packageImporter = require('node-sass-package-importer')
const glob = require('gulp-sass-glob')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')

// js
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// tpl
const pug = require('gulp-pug')

const buildMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const isProd = buildMode === 'production'

/* TASKS
-------------------------------------------------- */

/* Browser */

gulp.task('browser', () => {
	return browserSync({
		server: {
			baseDir: './dist/',
			directory: true
		},
		notify: false
	})
})

/* Templates */

gulp.task('templates', () => {
	const fonts = []

	if (config.appendFontsToHead) {
		fs.readdirSync('./src/fonts').forEach(file => {
			const name = `./src/fonts/${file}`

			if (!fs.statSync(name).isDirectory() && path.extname(name) === '.woff2') {
				fonts.push(path.basename(file, path.extname(name)))
			}
		})
	}

	return gulp
		.src(['src/templates/**/*', '!src/templates/mixins/*', '!src/templates/blocks/*', '!src/templates/layouts/*'], {
			base: '.'
		})
		.pipe(
			data(() => JSON.parse(fs.readFileSync('src/data.json')))
		)
		.pipe(pug())
		.pipe(
			cheerio({
				run ($, file) {
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
						fonts.forEach(filename => {
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
		.on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(flatten())
		.pipe(gulp.dest('dist/'))
		.on('end', () => {
			browserSync.reload()
		})
})

/* Styles */

gulp.task('css', () => {
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

	const postCssPlugins = [
		postcssPresetEnv(),
		autoprefixer({
			grid: true
		})
	]

	if (isProd) {
		postCssPlugins.push(
			cssnano({
				zindex: false
			})
		)
	}

	return gulp
		.src(src, {
			base: '.'
		})
		.pipe(glob())
		.pipe(
			sass({
				includePaths: ['node_modules'],
				importer: packageImporter()
			})
		)
		.on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(postcss(postCssPlugins))
		.on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(gcmq())
		.pipe(flatten())
		.pipe(
			rename({
				suffix: '.min'
			})
		)
		// .pipe(
		// 	rename(obj => {
		// 		if (obj.basename !== 'app.min') {
		// 			obj.dirname += '/pages'
		// 		}
		// 	})
		// )
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(
			browserSync.reload({
				stream: true
			})
		)
})

/* Fonts */

gulp.task('fonts', () => {
	return gulp
		.src('src/fonts/**/*', {
			base: './src/fonts/'
		})
		.pipe(gulp.dest('dist/assets/fonts/'))
		.on('error', notify.onError('Error: <%= error.message %>'))
		.on('end', () => {
			browserSync.reload()
		})
})

/* Images */

gulp.task('img', () => {
	return gulp
		.src('src/img/**/*', {
			base: './src/img/'
		})
		.pipe(gulp.dest('dist/assets/img/'))
		.on('error', notify.onError('Error: <%= error.message %>'))
		.on('end', () => {
			browserSync.reload()
		})
})

/* Scripts */

const webpackConfig = {
	mode: buildMode,
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
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react', 'vue']
						}
					}
				]
			},
			{
				test: /.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env', '@babel/preset-react']
						}
					}
				]
			},
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'vue-loader',
						options: {
							presets: ['@babel/preset-env', 'vue']
						}
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

gulp.task('js', () => {
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
		.pipe(
			webpackStream(webpackConfig, webpack, (err, stats) => {
				if (stats.compilation.errors.length) {
					notify('Error: <%= stats.compilation.errors[0].error %>')
				}
			})
		)
		// .pipe(
		// 	rename(obj => {
		// 		if (obj.basename !== 'app.min' && (obj.basename !== 'app.min.js')) {
		// 			obj.dirname += '/pages'
		// 		}
		// 	})
		// )
		.pipe(gulp.dest('dist/assets/js/'))
		.on('end', () => {
			browserSync.reload()
		})
})

/* Clean */

gulp.task('clean', () => {
	return del(['dist/*'])
})

/* Common */

gulp.task('watch', () => {
	gulp.watch('src/css/**/*', gulp.series('css'))
	gulp.watch('src/js/**/*', gulp.series('js'))
	gulp.watch('src/img/**/*', gulp.series('img'))
	gulp.watch('src/fonts/**/*', gulp.series('fonts'))
	gulp.watch(['src/templates/**/*', 'src/img/**/*.svg'], gulp.series('templates'))
	gulp.watch('src/data.json', gulp.series('templates'))

	notify('Project is running!')
})

gulp.task('build', gulp.series('clean', 'css', 'js', 'img', 'fonts', 'templates'), () => {
	notify('Project building done!')
})

gulp.task('default', gulp.parallel('browser', 'watch'))
