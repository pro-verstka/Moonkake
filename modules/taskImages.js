const gulp = require('gulp')
const { browserSync } = require('./taskBrowser')

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

module.exports = images
