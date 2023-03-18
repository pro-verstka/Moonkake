import gulp from 'gulp'
import { browserSync } from './taskBrowser.mjs'

export function fonts() {
	return gulp
		.src('src/fonts/**/*', {
			base: './src/fonts/'
		})
		.pipe(gulp.dest('dist/assets/fonts/'))
		.on('end', () => {
			browserSync.reload()
		})
}
