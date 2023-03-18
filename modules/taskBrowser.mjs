import { create } from 'browser-sync'

export const browserSync = create()

export function browser() {
	browserSync.init({
		server: {
			baseDir: './dist',
			directory: true
		},
		notify: false,
		open: false
	})
}
