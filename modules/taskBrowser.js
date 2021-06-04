const browserSync = require('browser-sync').create()

function browser() {
	browserSync.init({
		server: {
			baseDir: './dist',
			directory: true
		},
		notify: false,
		open: false
	})
}

module.exports = { browser, browserSync }
