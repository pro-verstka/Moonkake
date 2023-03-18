import gulp from 'gulp'
import { browserSync } from './taskBrowser.mjs'

export function images() {
	return gulp
		.src('src/img/**/*', {
			base: './src/img/'
		})
		.pipe(gulp.dest('dist/assets/img/'))
		.on('end', () => {
			browserSync.reload()
		})
}
