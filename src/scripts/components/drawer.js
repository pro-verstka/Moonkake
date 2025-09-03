import gsap from 'gsap'
import { ScrollLock } from '$utils'

export class Drawer {
	constructor(options = {}) {
		this.options = {
			selector: '[data-drawer]',
			toggleButton: '[data-drawer-toggle]',
			closeButton: '[data-drawer-close]',
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$drawer = document.querySelector(this.options.selector)

		if (!this.$drawer) {
			return
		}

		this.$toggleButton = document.querySelector(this.options.toggleButton)
		this.$closeButton = document.querySelector(this.options.closeButton)
		this.$html = document.documentElement

		this.isOpened = false

		this.scrollLock = new ScrollLock()

		this.#init()
	}

	#init() {
		this.$toggleButton.addEventListener('click', e => {
			e.preventDefault()

			if (!this.isOpened) {
				this.open()
			}

			if (this.isOpened) {
				this.close()
			}
		})

		this.$closeButton.addEventListener('click', e => {
			e.preventDefault()

			this.close()
		})

		document.addEventListener('keyup', e => {
			if (e.key === 'Escape') {
				this.close()
			}
		})

		document.addEventListener('click', e => {
			if (!this.isOpened) {
				return
			}

			if (e.target.closest(this.options.selector) || e.target.closest(this.options.toggleButton)) {
				return
			}

			this.close()
		})
	}

	open() {
		if (this.isOpened) return

		this.$html.classList.add('-drawer-opened')
		this.$toggleButton.classList.add('-active')

		this.scrollLock.lockScroll()

		gsap
			.fromTo(
				this.$drawer,
				{
					y: '-100%',
				},
				{
					duration: 0.25,
					y: '0%',
				},
			)
			.eventCallback('onComplete', () => {
				this.isOpened = true
			})
	}

	close() {
		this.$html.classList.remove('-drawer-opened')
		this.$toggleButton.classList.remove('-active')

		gsap.to(this.$drawer, {
			duration: 0.25,
			y: '-100%',

			onComplete: () => {
				this.scrollLock.unlockScroll()

				this.isOpened = false
			},
		})
	}
}
