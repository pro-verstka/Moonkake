import FontFaceObserver from 'fontfaceobserver/fontfaceobserver'

export class FontLoader {
	constructor(fonts = ['FONT_NAME']) {
		this.fonts = fonts

		this.#init()
	}

	#init() {
		this.#loadFonts()
			.then(() => {
				document.documentElement.classList.add('-fonts-ready')

				sessionStorage.fontsLoaded = true
			})
			.catch(() => {
				sessionStorage.fontsLoaded = false
			})
	}

	async #loadFonts() {
		const queue = this.fonts.map(fontName =>
			new FontFaceObserver(fontName).load(),
		)

		await Promise.all(queue)
	}
}
