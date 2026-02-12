import { emitEvent } from '$helpers'

const MODE = {
	TEXT: 'text',
	HTML: 'html',
}

const STATE = {
	OPENED: 'opened',
	CLOSED: 'closed',
}

const EVENT = {
	TOGGLE: 'mk:spoiler:toggle',
}

export class Spoiler {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			selectors: {
				body: '[data-spoiler-body]',
				intro: '[data-spoiler-intro]',
				toggle: '[data-spoiler-toggle]',
			},
			mode: MODE.TEXT,
			trim: 100,
			postfix: '...',
			labels: ['Показать', 'Скрыть'],
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

		if (!Object.values(MODE).includes(this.options.mode)) {
			this.options.mode = MODE.TEXT
		}

		this.selectors = this.options.selectors
		this.$body = this.$root.querySelector(this.selectors.body)
		this.$intro = this.$root.querySelector(this.selectors.intro)
		this.$toggle = this.$root.querySelector(this.selectors.toggle)
		this.canCollapse = true

		if (!this.$body) {
			return
		}

		this.#init()
	}

	#init() {
		this.#setupMarkup()
		this.#setupState()
		this.#setupListeners()
	}

	#setupMarkup() {
		this.$root.dataset.mode = this.options.mode
		this.$root.dataset.initialized = 'true'

		if (this.options.mode === MODE.TEXT) {
			this.#setupTextModeMarkup()
		}

		if (this.options.mode === MODE.HTML) {
			this.#setupHtmlModeMarkup()
		}
	}

	#setupTextModeMarkup() {
		const text = this.$body.textContent.trim()

		if (text.length <= this.options.trim) {
			this.canCollapse = false
			return
		}

		if (!this.$intro) {
			this.$intro = document.createElement('div')
			this.$intro.setAttribute('data-spoiler-intro', '')
			this.$root.insertBefore(this.$intro, this.$body)
		}

		this.$intro.textContent = `${text.slice(0, this.options.trim)}${this.options.postfix}`
		this.#ensureToggle()
	}

	#setupHtmlModeMarkup() {
		this.#ensureToggle()
	}

	#ensureToggle() {
		if (this.$toggle) {
			return
		}

		this.$toggle = document.createElement('button')
		this.$toggle.setAttribute('data-spoiler-toggle', '')
		this.$root.insertBefore(this.$toggle, this.$body.nextSibling)
	}

	#setupState() {
		if (!this.canCollapse) {
			this.$root.dataset.state = STATE.OPENED
			this.$toggle?.setAttribute('hidden', '')
			return
		}

		const { state } = this.$root.dataset
		const isValidState = Object.values(STATE).includes(state)

		if (!isValidState) {
			this.$root.dataset.state = STATE.CLOSED
		}

		this.#syncToggleLabel()
	}

	#setupListeners() {
		if (!this.$toggle || !this.canCollapse) {
			return
		}

		this.$toggle.addEventListener('click', event => {
			event.preventDefault()
			this.toggle()
		})
	}

	#syncToggleLabel() {
		if (!this.$toggle) {
			return
		}

		const [closedLabel = '', openedLabel = ''] = this.options.labels
		const label = this.$root.dataset.state === STATE.OPENED ? openedLabel : closedLabel
		this.$toggle.textContent = label
	}

	toggle() {
		if (!this.canCollapse) {
			return
		}

		const nextState = this.$root.dataset.state === STATE.OPENED ? STATE.CLOSED : STATE.OPENED
		this.$root.dataset.state = nextState

		this.#syncToggleLabel()

		emitEvent(EVENT.TOGGLE, {
			root: this.$root,
			state: nextState,
		})
	}
}
