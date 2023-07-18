import gulp from 'gulp'
import fs from 'node:fs'
import path from 'node:path'
import pug from 'gulp-pug'
import flatten from 'gulp-flatten'
import cheerio from 'gulp-cheerio'
import { browserSync } from './taskBrowser.mjs'
import { config } from './config.mjs'

export function templates() {
	const fontFiles = []

	if (config.appendFontsToHead) {
		fs.readdirSync('./src/fonts').forEach(file => {
			const name = `./src/fonts/${file}`

			if (!fs.statSync(name).isDirectory() && path.extname(name) === '.woff2') {
				fontFiles.push(path.basename(file, path.extname(name)))
			}
		})
	}

	const jsonFiles = {}

	fs.readdirSync('./src/data').forEach(file => {
		const name = `./src/data/${file}`

		if (!fs.statSync(name).isDirectory() && path.extname(name) === '.json') {
			const key = path.basename(file, path.extname(name))
			jsonFiles[key] = JSON.parse(fs.readFileSync(name))
		}
	})

	return gulp
		.src(['src/templates/**/*', '!src/templates/mixins/*', '!src/templates/widgets/*', '!src/templates/layouts/*'], {
			base: '.'
		})
		.pipe(
			pug({
				pretty: true,
				data: {
					// require,
					...jsonFiles
				}
			})
		)
		.pipe(
			cheerio({
				run($, file) {
					const name = path.basename(file.path, path.extname(file.path))
					const time = new Date().getTime()
					const $css = $('[data-app-css]')
					const $js = $('[data-app-js]')

					if (fs.existsSync(`./src/css/pages/${name}.scss`) && config.separateCssToPages) {
						$css.after(`\n\t\t<link rel="stylesheet" href="assets/css/${name}.min.css?v=${time}">`)
					}

					if (fs.existsSync(`./src/js/pages/${name}.js`) && config.separateJsToPages) {
						$js.after(`\n\t\t<script defer src="assets/js/${name}.min.js?v=${time}"></script>`)
					}

					$css.removeAttr('data-app-css')
					$js.removeAttr('data-app-js')

					if (config.appendFontsToHead) {
						fontFiles.forEach(filename => {
							$('[rel="stylesheet"]')
								.eq(0)
								.before(
									`\n\t\t<link rel="preload" href="assets/fonts/${filename}.woff2" as="font" type="font/woff2" crossorigin>\n\t\t`
								)
						})
					}
				},
				parserOptions: {
					decodeEntities: false
				}
			})
		)
		.pipe(flatten())
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream())
}
