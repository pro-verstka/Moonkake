import tippy from 'tippy.js'

/**
 * Tippy.js tooltip wrapper.
 *
 * Markup:
 * <button data-tippy data-tippy-content="Tooltip text" type="button">Help</button>
 *
 * @example
 * document.querySelectorAll('[data-tippy]').forEach($el => new Tooltip($el))
 *
 * new Tooltip(document.querySelector('[data-tippy]'), {
 *   placement: 'bottom',
 *   maxWidth: 320,
 * })
 */
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
