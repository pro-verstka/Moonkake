const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const { browserSync } = require('./taskBrowser')
const pug = require('gulp-pug')
const flatten = require('gulp-flatten')
const cheerio = require('gulp-cheerio')
const { config } = require('./config')

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

	const jsonFiles = {}

	fs.readdirSync('./src/data').forEach(file => {
		const name = `./src/data/${file}`

		if (!fs.statSync(name).isDirectory() && path.extname(name) === '.json') {
			const key = path.basename(file, path.extname(name))
			jsonFiles[key] = JSON.parse(fs.readFileSync(name))
		}
	})

	return (
		gulp
			.src(['src/templates/**/*', '!src/templates/mixins/*', '!src/templates/blocks/*', '!src/templates/layouts/*'], {
				base: '.'
			})
			.pipe(
				pug({
					pretty: true,
					data: {
						require,
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

						if (fs.existsSync(`./src/css/pages/${name}.sass`) && config.separateCssToPages) {
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
			// .pipe(
			// 	prettify({
			// 		indent_size: 2,
			// 		indent_with_tabs: true,
			// 		indent_inner_html: true
			// 	})
			// )
			.pipe(flatten())
			.pipe(gulp.dest('dist/'))
			.pipe(browserSync.stream())
	)
}

module.exports = templates
