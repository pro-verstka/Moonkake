import { isMobile } from '../libs/utils'

class Fullheight {
	constructor(options = {}) {
		let defaults = {
			item: '[data-fullheight]',
			offset: 0
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults
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
		if (!this.$els.length || (event.type == 'resize' && isMobile())) return false

		this.$els.forEach($el => {
			let minHeight = parseFloat(window.getComputedStyle($el, null).getPropertyValue('min-height')) || 0
			let height = window.innerHeight <= minHeight ? minHeight : window.innerHeight
			let offset = parseFloat($el.getAttribute('data-fullheight-offset')) || this.options.offset

			$el.style.height = `${height + offset}px`
		})
	}
}

export default Fullheight
