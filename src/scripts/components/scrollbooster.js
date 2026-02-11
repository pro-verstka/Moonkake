import SB from 'scrollbooster'

export class ScrollBooster {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$viewport = $el

		this.options = {
			scrollMode: 'transform',
			direction: 'horizontal',
			emulateScroll: true,
			selectors: {
				content: '[data-scrollbooster-content]',
			},
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
			}
		}

		this.selectors = this.options.selectors

		this.$content = this.$viewport.querySelector(this.selectors.content)

		if (!this.$content) {
			return
		}

		this.#init()
	}

	#init() {
		const { selectors, ...options } = this.options

		this.scrollBooster = new SB({
			viewport: this.$viewport,
			content: this.$content,
			// onUpdate: data => {
			// 	this.$content.style.transform = `translateX(${-data.position.x}px)`
			// },
			shouldScroll: () => this.$content.clientWidth > this.$viewport.clientWidth,
			...options,
		})
	}
}
