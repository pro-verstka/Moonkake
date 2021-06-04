const gulp = require('gulp')
const { browserSync } = require('./taskBrowser')

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

module.exports = fonts
