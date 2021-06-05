import FontFaceObserver from 'fontfaceobserver/fontfaceobserver'

const loadFonts = async () => {
	await new FontFaceObserver('FONT_NAME').load()
}

loadFonts().then(() => {
	document.documentElement.classList.add('-fonts-ready')
})

// const font = new FontFaceObserver('FONT_NAME')
//
// Promise.all([font.load()]).then(() => {
// 	document.documentElement.classList.add('-fonts-ready')
// })
