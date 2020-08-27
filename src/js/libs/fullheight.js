import { isMobile } from './utils'

class Fullheight {
	constructor(options = {}) {
		this.options = {
			item: '[data-fullheight]',
			offset: 0
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$els = document.querySelectorAll(this.options.item)

		this.handle()
	}

	handle() {
		;['load', 'resize', 'orientationchange'].forEach(eventName => {
			window.addEventListener(eventName, event => {
				this.setFullheight(event)
			})
		})
	}

	setFullheight(event) {
		if (!this.$els.length || (event.type === 'resize' && isMobile())) return false

		this.$els.forEach($el => {
			const minHeight = parseFloat(window.getComputedStyle($el, null).getPropertyValue('min-height')) || 0
			const maxHeight = parseFloat(window.getComputedStyle($el, null).getPropertyValue('max-height')) || ''
			const offset = parseFloat($el.getAttribute('data-fullheight-offset')) || this.options.offset
			let height = window.innerHeight

			if (minHeight && window.innerHeight <= minHeight) {
				height = minHeight
			}

			if (maxHeight && window.innerHeight >= maxHeight) {
				height = maxHeight
			}

			$el.style.height = `${height + offset}px`
		})
	}
}

export default Fullheight
