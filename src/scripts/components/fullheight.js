import { device } from '../helpers'

export class FullHeight {
	constructor(options = {}) {
		this.options = {
			item: '[data-fullheight]',
			offset: 0,
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$els = document.querySelectorAll(this.options.item)

		this.handle()
	}

	handle() {
		for (const eventName of ['load', 'resize', 'orientationchange']) {
			window.addEventListener(eventName, event => {
				this.setFullHeight(event)
			})
		}
	}

	setFullHeight(event) {
		if (!this.$els.length || (event.type === 'resize' && device.isMobile())) return false

		for (const $element of this.$els) {
			const minHeight = Number.parseFloat(window.getComputedStyle($element, null).getPropertyValue('min-height')) || 0
			const maxHeight = Number.parseFloat(window.getComputedStyle($element, null).getPropertyValue('max-height')) || ''
			const offset = Number.parseFloat($element.getAttribute('data-fullheight-offset')) || this.options.offset
			let height = window.innerHeight

			if (minHeight && window.innerHeight <= minHeight) height = minHeight
			if (maxHeight && window.innerHeight >= maxHeight) height = maxHeight

			$element.style.height = `${height + offset}px`
		}

		return true
	}
}
