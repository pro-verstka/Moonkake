import { emitEvent, getScrollbarWidth } from '$helpers'

const STATE = {
	OPENED: 'opened',
	CLOSING: 'closing',
	CLOSED: 'closed',
}

const BODY_STATE = {
	LOCKED: 'locked',
	UNLOCKED: 'unlocked',
}

const EVENT = {
	END: 'mk:loader:end',
}

export class Loader {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.options = {
			eventName: EVENT.END,
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$loader = $el
		this.$body = document.body
		this.onTransitionEnd = this.#onTransitionEnd.bind(this)

		this.#init()
	}

	#init() {
		this.#setupInitialState()
		this.#lockBody()
		this.#setupListeners()
	}

	#setupInitialState() {
		const { state } = this.$loader.dataset
		const isValidState = Object.values(STATE).includes(state)

		if (!isValidState) {
			this.$loader.dataset.state = STATE.OPENED
		}
	}

	#setupListeners() {
		if (document.readyState === 'complete') {
			this.#onWindowLoad()
			return
		}

		window.addEventListener('load', this.#onWindowLoad.bind(this), { once: true })
	}

	#onWindowLoad() {
		this.#startClosing()
	}

	#startClosing() {
		if (this.$loader.dataset.state !== STATE.OPENED) {
			return
		}

		this.$loader.dataset.state = STATE.CLOSING
		this.$loader.addEventListener('transitionend', this.onTransitionEnd)
	}

	#onTransitionEnd(event) {
		if (event.target !== this.$loader) {
			return
		}

		this.$loader.removeEventListener('transitionend', this.onTransitionEnd)
		this.#handle()
	}

	#handle() {
		this.$loader.dataset.state = STATE.CLOSED
		this.#unlockBody()

		emitEvent(this.options.eventName)
	}

	#lockBody() {
		this.$body.style.paddingRight = `${getScrollbarWidth()}px`
		this.$body.dataset.loaderState = BODY_STATE.LOCKED
	}

	#unlockBody() {
		this.$body.style.paddingRight = ''
		this.$body.dataset.loaderState = BODY_STATE.UNLOCKED
	}
}
