import gulp from 'gulp'
import { deleteAsync } from 'del'
import { templates } from './modules/taskTemplates.mjs'
import { styles } from './modules/taskStyles.mjs'
import { fonts } from './modules/taskFonts.mjs'
import { images } from './modules/taskImages.mjs'
import { browser } from './modules/taskBrowser.mjs'
import { scripts } from './modules/taskScripts.mjs'

/* TASKS
-------------------------------------------------- */

function clean() {
	return deleteAsync(['./dist/*'])
}

export const taskImages = images
export const taskFonts = fonts
export const taskScripts = scripts
export const taskStyles = styles
export const taskTemplates = templates
export const build = gulp.series(clean, gulp.parallel(taskFonts, taskImages, taskStyles, taskScripts), taskTemplates)

export default gulp.parallel(browser, () => {
	gulp.watch(['src/css/**/*'], taskStyles)
	gulp.watch(['src/js/**/*'], taskScripts)
	gulp.watch(['src/fonts/**/*'], taskFonts)
	gulp.watch(['src/img/**/*'], taskImages)
	gulp.watch(['src/templates/**/*', 'src/img/**/*.svg'], taskTemplates)
	gulp.watch(['src/data/**/*.json'], gulp.parallel(taskScripts, taskTemplates))
})
