const templates = require('./modules/taskTemplates')
const styles = require('./modules/taskStyles')
const fonts = require('./modules/taskFonts')
const images = require('./modules/taskImages')
const scripts = require('./modules/taskScripts')
const { browser } = require('./modules/taskBrowser')

/* COMMON
-------------------------------------------------- */

const { watch, parallel, series } = require('gulp')
const del = require('del')

/* TASKS
-------------------------------------------------- */

function clean() {
	return del(['./dist/*'])
}

exports.images = images
exports.fonts = fonts
exports.scripts = scripts
exports.styles = styles
exports.templates = templates
exports.build = series(clean, parallel(fonts, images, styles, scripts), templates)

exports.default = parallel(browser, () => {
	watch(['src/css/**/*'], styles)
	watch(['src/js/**/*'], scripts)
	watch(['src/fonts/**/*'], fonts)
	watch(['src/img/**/*'], images)
	watch(['src/templates/**/*', 'src/img/**/*.svg'], templates)
	watch(['src/data/**/*.json'], parallel(scripts, templates))
})
