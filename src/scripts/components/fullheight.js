import { isMobile } from '$helpers'

/**
 * Sets an element height to the viewport height with an optional offset.
 *
 * Markup:
 * <section data-fullheight data-fullheight-offset="-80"></section>
 *
 * Reads CSS min-height/max-height as bounds.
 *
 * @example
 * document.querySelectorAll('[data-fullheight]').forEach($el => new FullHeight($el))
 *
 * new FullHeight(document.querySelector('[data-fullheight]'), {
 *   offset: -80,
 * })
 */
export class FullHeight {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			offset: 0,
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.#init()
	}

	#init() {
		this.#setupListeners()
	}

	#setupListeners() {
		for (const eventName of ['load', 'resize', 'orientationchange']) {
			window.addEventListener(eventName, event => this.#setFullHeight(event))
		}
	}

	#setFullHeight(event) {
		if (!this.$root.length || (event.type === 'resize' && isMobile())) {
			return
		}

		const minHeight = Number.parseFloat(window.getComputedStyle(this.$root, null).getPropertyValue('min-height')) || 0
		const maxHeight = Number.parseFloat(window.getComputedStyle(this.$root, null).getPropertyValue('max-height')) || ''
		const offset = Number.parseFloat(this.$root.getAttribute('data-fullheight-offset')) || this.options.offset
		let height = window.innerHeight

		if (minHeight && window.innerHeight <= minHeight) height = minHeight
		if (maxHeight && window.innerHeight >= maxHeight) height = maxHeight

		this.$root.style.height = `${height + offset}px`
	}
}
