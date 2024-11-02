import FontFaceObserver from 'fontfaceobserver'

if (!sessionStorage.fontsLoaded) {
	const fontName = new FontFaceObserver('FONT_NAME')

	Promise.all([fontName.load()]).then(() => {
		document.documentElement.classList.add('-fonts-ready')

		sessionStorage.fontsLoaded = true
	})
}
