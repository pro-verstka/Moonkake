import { getScrollbarWidth, device } from '../helpers'

export class ScrollLock {
	constructor() {
		this.scrollY = 0
		this.$elements = document.querySelectorAll('[data-scroll-lock-fix-shift]')
	}

	lockScroll() {
		const scrollBarWidth = getScrollbarWidth()

		document.body.style.overflow = 'hidden'

		this.$elements?.forEach($el => {
			const paddingRight = parseInt(window.getComputedStyle($el).paddingRight)

			$el.style.paddingRight = `${paddingRight + scrollBarWidth}px`
		})

		if (device.isIOS()) {
			this.scrollY = window.scrollY
			document.body.style.position = 'fixed'
			document.body.style.top = `-${this.scrollY}px`
			document.body.style.width = '100%'
		}
	}

	unlockScroll() {
		this.$elements?.forEach($el => {
			$el.style.paddingRight = ''
		})

		document.body.style.overflow = ''

		if (device.isIOS()) {
			document.body.style.position = ''
			document.body.style.top = ''
			document.body.style.width = ''
			window.scrollTo(0, this.scrollY)
		}
	}
}
