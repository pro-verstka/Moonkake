import tippy from 'tippy.js'

export class Tooltip {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			allowHTML: true,
			delay: [100, 100],
			interactive: true,
			maxWidth: 200,
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
			}
		}

		this.#init()
	}

	#init() {
		this.tooltip = tippy(this.$root, this.options)
	}
}
