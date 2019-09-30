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
const gulpif = require('gulp-if')
const del = require('del')
const data = require('gulp-data')

// css
const gcmq = require('gulp-group-css-media-queries')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')

//sass
const sass = require('gulp-sass')
const glob = require('gulp-sass-glob')

// js
const webpackStream = require('webpack-stream')
const uglify = require('gulp-uglify')

// tpl
const pug = require('gulp-pug')

let buildMode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
let isProd = buildMode === 'production'

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
	return gulp
		.src(['src/templates/**/*', '!src/templates/mixins/*', '!src/templates/blocks/*', '!src/templates/layouts/*'], {
			base: '.'
		})
		.pipe(
			data(function(file) {
				return JSON.parse(fs.readFileSync('src/data.json'))
			})
		)
		.pipe(
			pug({
				pretty: isProd
			})
		)
		.on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(flatten())
		.pipe(gulp.dest('dist/'))
		.on('end', function() {
			browserSync.reload()
		})
})

/* Styles */

gulp.task('css', () => {
	// sass
	let src = []
	let dir = './src/css'
	let files = fs.readdirSync(dir)

	files.forEach(file => {
		let name = dir + '/' + file

		if (!fs.statSync(name).isDirectory() && path.extname(name) == '.sass') {
			src.push(name)
		}
	})

	return gulp
		.src(src, {
			base: '.'
		})
		.pipe(glob())
		.pipe(
			sass({
				includePaths: ['node_modules']
			})
		)
		.on('error', notify.onError('Error: <%= error.message %>'))
		.pipe(
			autoprefixer({
				//browsers: ['last 3 version', 'ie >= 11'],
				grid: true
			})
		)
		.pipe(gcmq())
		.pipe(
			gulpif(
				isProd,
				cssnano({
					zindex: false
				})
			)
		)
		.pipe(flatten())
		.pipe(
			rename({
				suffix: '.min'
			})
		)
		.pipe(gulp.dest('dist/assets/css/'))
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
		.on('end', function() {
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
		.on('end', function() {
			browserSync.reload()
		})
})

/* Scripts */

let webpackConfig = {
	mode: buildMode,
	entry: {
		app: './src/js/app.js'
	},
	output: {
		filename: '[name].min.js'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.jsx?$/],
				loader: 'babel-loader',
				query: {
					presets: ['@babel/preset-env']
				}
			}
		]
	},
	externals: {
		jquery: 'jQuery'
	}
}

gulp.task('js', () => {
	return gulp
		.src(Object.values(webpackConfig.entry))
		.pipe(
			webpackStream(webpackConfig, null, (err, stats) => {
				if (stats.compilation.errors.length) {
					notify('Error: <%= stats.compilation.errors[0].error %>')
				}
			})
		)
		.pipe(
			gulpif(
				isProd,
				uglify({
					compress: {
						collapse_vars: false
					}
				})
			)
		)
		.pipe(gulp.dest('dist/assets/js/'))
		.on('end', function() {
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
	gulp.watch('src/img/**/*', gulp.series('img'))
	gulp.watch('src/fonts/**/*', gulp.series('fonts'))
	gulp.watch('src/js/**/*', gulp.series('js'))
	gulp.watch('src/templates/**/*', gulp.series('templates'))
	gulp.watch('src/data.json', gulp.series('templates'))

	notify('Project is running!')
})

gulp.task('build', gulp.series('clean', 'css', 'img', 'fonts', 'js', 'templates'), () => {
	notify('Project building done!')
})

gulp.task('default', gulp.parallel('browser', 'watch'))
