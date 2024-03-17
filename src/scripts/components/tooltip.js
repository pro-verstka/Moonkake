import tippy from 'tippy.js'

export class Tooltip {
	constructor(selector = '[data-tippy]') {
		this.selector = selector

		this.#init()
	}

	#init() {
		tippy(this.selector, {
			allowHTML: true,
			delay: [100, 100],
			interactive: true,
			maxWidth: 200,
		})
	}
}
