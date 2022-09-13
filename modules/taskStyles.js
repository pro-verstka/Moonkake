const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const { browserSync } = require('./taskBrowser')
const flatten = require('gulp-flatten')
const rename = require('gulp-rename')
const gcmq = require('gulp-group-css-media-queries')
const cssnano = require('cssnano')
const sass = require('gulp-dart-sass')
const postcss = require('gulp-postcss')
const postcssPresetEnv = require('postcss-preset-env')
const parseSassToObject = require('./parseSassToObject')

const { config, isProd } = require('./config')

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
				// grid: true
			},
			importFrom: [
				{
					customProperties: parseSassToObject('./src/css/config/_root.sass')
				}
			],
			features: {
				'custom-properties': {
					disableDeprecationNotice: true
				}
			}
		})
	]

	if (isProd) {
		plugins.push(
			cssnano({
				preset: [
					'default',
					{
						zindex: false
					}
				]
			})
		)
	}

	return gulp
		.src(src, {
			base: '.'
		})
		.pipe(
			sass({
				includePaths: ['node_modules']
				// indentedSyntax: true,
				// indentType: 'tab',
				// indentWidth: 2
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

module.exports = styles
