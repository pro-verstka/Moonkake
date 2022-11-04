import { getScrollbarWidth } from '../helpers'

class ScrollLock {
	constructor() {
		this.scrollY = 0
		this.$body = document.body
		this.$fixShift = document.querySelectorAll('[data-scroll-lock-fix-shift]')
	}

	disable() {
		this.scrollY = window.scrollY

		this.$fixShift.forEach($el => {
			$el.style.paddingRight = `${getScrollbarWidth()}px`
		})

		this.$body.classList.add('-scroll-lock')
		this.$body.style.top = `-${this.scrollY}px`
	}

	enable() {
		this.$body.classList.remove('-scroll-lock')
		this.$body.style.top = ''

		window.scrollTo(0, this.scrollY)

		this.$fixShift.forEach($el => {
			$el.style.paddingRight = ''
		})
	}
}

export default ScrollLock
