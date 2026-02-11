import { emitEvent } from '$helpers'

const STATE = {
	OPENED: 'opened',
	CLOSED: 'closed',
}

const EVENT = {
	TOGGLE: 'mk:accordion:toggle',
}

export class Accordion {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			selectors: {
				item: '[data-accordion-item]',
				handler: '[data-accordion-handler]',
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

		this.#init()
	}

	#init() {
		this.#setupInitialState()
		this.#enrichRoot()
		this.#enrichItems()
		this.#setupListeners()
	}

	get items() {
		return this.$root.querySelectorAll(this.selectors.item)
	}

	get handlers() {
		return this.$root.querySelectorAll(this.selectors.handler)
	}

	#setupInitialState() {
		for (const $item of this.items) {
			const { state } = $item.dataset
			const isValidState = Object.values(STATE).includes(state)

			if (!isValidState) {
				$item.dataset.state = STATE.CLOSED
			}
		}
	}

	#enrichRoot() {
		this.$root.toggleItem = $item => this.toggle($item)
	}

	#enrichItems() {
		for (const $item of this.items) {
			$item.toggleItem = () => this.toggle($item)
		}
	}

	#setupListeners() {
		for (const $handler of this.handlers) {
			$handler.addEventListener('click', () => {
				const $item = $handler.closest(this.selectors.item)

				if (!$item || !this.$root.contains($item)) {
					return
				}

				this.toggle($item)
			})
		}
	}

	toggle($item) {
		const state = $item.dataset.state === STATE.OPENED ? STATE.CLOSED : STATE.OPENED
		$item.dataset.state = state

		emitEvent(EVENT.TOGGLE, {
			root: this.$root,
			item: $item,
			state,
		})
	}
}
