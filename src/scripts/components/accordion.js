import { emitEvent } from '$helpers'

const STATE = {
	OPENED: 'opened',
	CLOSED: 'closed',
}

const EVENT = {
	TOGGLE: 'mk:accordion:toggle',
}

export class Accordion {
	constructor($el) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.selectors = {
			item: '[data-accordion-item]',
			handler: '[data-accordion-handler]',
		}

		this.#init()
	}

	#init() {
		this.#setupInitialState()
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

	#enrichItems() {
		for (const $item of this.items) {
			$item.toggle = () => this.toggle($item)
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
