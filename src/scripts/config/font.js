if (!sessionStorage.fontsLoaded) {
	Promise.all([document.fonts.load('FONT_NAME')]).then(() => {
		document.documentElement.classList.add('-fonts-ready')

		sessionStorage.fontsLoaded = true
	})
}
