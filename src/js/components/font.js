import FontFaceObserver from 'fontfaceobserver/fontfaceobserver'

const font = new FontFaceObserver('FONT_NAME')

Promise.all([font.load()]).then(() => {
	document.documentElement.classList.add('-fonts-ready')
})
