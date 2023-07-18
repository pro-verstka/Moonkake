import gulp from 'gulp'
import fs from 'node:fs'
import path from 'node:path'
import flatten from 'gulp-flatten'
import rename from 'gulp-rename'
import gcmq from 'gulp-group-css-media-queries'
import cssnano from 'cssnano'
import sass from 'gulp-dart-sass'
import postcss from 'gulp-postcss'
import postcssPresetEnv from 'postcss-preset-env'
import { browserSync } from './taskBrowser.mjs'
import { parseSassToObject } from './parseSassToObject.mjs'
import { config, isProd } from './config.mjs'

export function styles() {
	const src = []

	fs.readdirSync('./src/css').forEach(file => {
		const name = `./src/css/${file}`

		if (!fs.statSync(name).isDirectory() && path.extname(name) === '.scss') {
			src.push(name)
		}
	})

	if (config.separateCssToPages) {
		fs.readdirSync('./src/css/pages').forEach(file => {
			const name = `./src/css/pages/${file}`

			if (!fs.statSync(name).isDirectory() && path.extname(name) === '.scss') {
				src.push(name)
			}
		})
	}

	const plugins = [
		postcssPresetEnv({
			importFrom: [
				{
					customProperties: parseSassToObject('./src/css/config/_root.scss')
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
