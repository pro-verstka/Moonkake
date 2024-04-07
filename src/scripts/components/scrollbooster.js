import SB from 'scrollbooster'

export class ScrollBooster {
	constructor($el) {
		this.$viewport = $el || document.querySelector('[data-scrollbooster]')
		this.$content = this.$viewport.querySelector('[data-scrollbooster-content]')

		this.#init()
	}

	#init() {
		this.scrollBooster = new SB({
			viewport: this.$viewport,
			content: this.$content,
			scrollMode: 'transform',
			direction: 'horizontal',
			emulateScroll: true,
			// onUpdate: data => {
			// 	this.$content.style.transform = `translateX(${-data.position.x}px)`
			// },
			shouldScroll: () => this.$content.clientWidth > this.$viewport.clientWidth,
		})
	}
}
