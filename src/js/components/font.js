import FontFaceObserver from 'fontfaceobserver/fontfaceobserver'

const loadFonts = async () => {
	await new FontFaceObserver('FONT_NAME').load()
}

loadFonts()
	.then(() => {
		document.documentElement.classList.add('-fonts-ready')

		sessionStorage.fontsLoaded = true
	})
	.catch(() => {
		sessionStorage.fontsLoaded = false
	})
