import { Device } from '../helpers'

class FullHeight {
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
				this.setFullHeight(event)
			})
		})
	}

	setFullHeight(event) {
		if (!this.$els.length || (event.type === 'resize' && Device.isMobile())) return false

		this.$els.forEach($el => {
			const $element = $el
			const minHeight = parseFloat(window.getComputedStyle($element, null).getPropertyValue('min-height')) || 0
			const maxHeight = parseFloat(window.getComputedStyle($element, null).getPropertyValue('max-height')) || ''
			const offset = parseFloat($element.getAttribute('data-fullheight-offset')) || this.options.offset
			let height = window.innerHeight

			if (minHeight && window.innerHeight <= minHeight) height = minHeight
			if (maxHeight && window.innerHeight >= maxHeight) height = maxHeight

			$element.style.height = `${height + offset}px`
		})

		return true
	}
}

export default FullHeight
