import { getScrollbarWidth } from './utils'

class Loader {
	constructor(options = {}) {
		this.options = {
			selector: '[data-loader]',
			eventName: 'loader',
			classnames: {
				lock: '-loader-lock',
				closing: '-closing',
				closed: '-closed'
			}
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$loader = document.querySelector(this.options.selector)
		this.$body = document.body

		if (!this.$loader) return

		this.init()
	}

	init() {
		this.$body.style.paddingRight = getScrollbarWidth() + 'px'
		this.$body.classList.add(this.options.classnames.lock)

		window.addEventListener('load', e => {
			this.$loader.classList.add(this.options.classnames.closing)
			this.$loader.addEventListener('transitionend', () => this.handle())
		})
	}

	handle() {
		this.$loader.classList.remove(this.options.classnames.closing)
		this.$loader.classList.add(this.options.classnames.closed)
		this.$loader.removeEventListener('transitionend', () => this.handle())

		this.$body.style.paddingRight = ''
		this.$body.classList.remove(this.options.classnames.lock)

		window.dispatchEvent(
			new CustomEvent(this.options.eventName, {
				bubbles: true
			})
		)
	}
}

export default Loader
