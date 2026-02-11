import gsap from 'gsap'
import { emitEvent } from '$helpers'
import { ScrollLock } from '$utils'

const STATE = {
	OPENED: 'opened',
	OPENING: 'opening',
	CLOSED: 'closed',
	CLOSING: 'closing',
}

const EVENT = {
	OPEN: 'mk:drawer:open',
	CLOSE: 'mk:drawer:close',
}

export class Drawer {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.options = {
			selectors: {
				toggleButton: '[data-drawer-toggle]',
				closeButton: '[data-drawer-close]',
			},
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
			}
		}

		this.selectors = this.options.selectors

		this.$drawer = $el
		this.$toggleButton = document.querySelector(this.selectors.toggleButton)
		this.$closeButton = document.querySelector(this.selectors.closeButton)
		this.$html = document.documentElement

		this.isOpened = false

		this.scrollLock = new ScrollLock()

		this.#init()
	}

	#init() {
		this.#setupInitialState()
		this.#setupListeners()
	}

	#setupInitialState() {
		this.$drawer.dataset.state = STATE.CLOSED
		this.$toggleButton?.setAttribute('data-state', STATE.CLOSED)
		this.$html.dataset.drawerState = STATE.CLOSED
	}

	#setupListeners() {
		this.$toggleButton?.addEventListener('click', e => {
			e.preventDefault()

			if (!this.isOpened) {
				this.open()
			}

			if (this.isOpened) {
				this.close()
			}
		})

		this.$closeButton?.addEventListener('click', e => {
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

			if (!(e.target instanceof Element)) {
				return
			}

			if (this.$drawer.contains(e.target) || this.$toggleButton?.contains(e.target)) {
				return
			}

			this.close()
		})
	}

	open() {
		if (this.isOpened || this.$drawer.dataset.state === STATE.OPENING) return

		this.$drawer.dataset.state = STATE.OPENING
		this.$toggleButton?.setAttribute('data-state', STATE.OPENING)
		this.$html.dataset.drawerState = STATE.OPENING

		this.scrollLock.lockScroll()

		gsap.fromTo(
			this.$drawer,
			{
				y: '-100%',
			},
			{
				duration: 0.25,
				y: '0%',

				onComplete: () => {
					this.isOpened = true
					this.$drawer.dataset.state = STATE.OPENED
					this.$toggleButton?.setAttribute('data-state', STATE.OPENED)
					this.$html.dataset.drawerState = STATE.OPENED

					emitEvent(EVENT.OPEN, {
						root: this.$drawer,
					})
				},
			},
		)
	}

	close() {
		if (this.$drawer.dataset.state === STATE.CLOSING) {
			return
		}

		if (!this.isOpened && this.$drawer.dataset.state !== STATE.OPENING) {
			return
		}

		this.$drawer.dataset.state = STATE.CLOSING
		this.$toggleButton?.setAttribute('data-state', STATE.CLOSING)
		this.$html.dataset.drawerState = STATE.CLOSING

		gsap.to(this.$drawer, {
			duration: 0.25,
			y: '-100%',

			onComplete: () => {
				this.scrollLock.unlockScroll()

				this.isOpened = false
				this.$drawer.dataset.state = STATE.CLOSED
				this.$toggleButton?.setAttribute('data-state', STATE.CLOSED)
				this.$html.dataset.drawerState = STATE.CLOSED

				emitEvent(EVENT.CLOSE, {
					root: this.$drawer,
				})
			},
		})
	}
}
