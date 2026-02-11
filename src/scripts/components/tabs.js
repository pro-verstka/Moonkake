import { emitEvent } from '$helpers'

const STATE = {
	OPENED: 'opened',
	CLOSED: 'closed',
}

const EVENT = {
	CHANGE: 'mk:tabs:change',
}

const HISTORY = {
	SOURCE: 'tabs',
}

export class Tabs {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			useHashNav: false,
			selectors: {
				header: '[data-tabs-header]',
				body: '[data-tabs-body]',
				item: '[data-tabs-item]',
				handler: '[data-tabs-handler]',
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

		if (this.options.useHashNav) {
			this.#setupPopstateListener()
			this.#setupWindowLoadListener()
		}
	}

	#enrichRoot() {
		this.$root.changeTab = (index, changeHash = true) => this.changeTab(index, changeHash)
	}

	#enrichItems() {
		this.headerItems.forEach(($item, index) => {
			$item.openTab = (changeHash = true) => this.changeTab(index, changeHash)
		})

		this.bodyItems.forEach(($item, index) => {
			$item.openTab = (changeHash = true) => this.changeTab(index, changeHash)
		})
	}

	get headerItems() {
		const $header = this.$root.querySelector(this.selectors.header)
		return $header ? Array.from($header.querySelectorAll(this.selectors.item)) : []
	}

	get bodyItems() {
		const $body = this.$root.querySelector(this.selectors.body)
		return $body ? Array.from($body.querySelectorAll(this.selectors.item)) : []
	}

	get handlers() {
		return Array.from(this.$root.querySelectorAll(this.selectors.handler))
	}

	#setupInitialState() {
		const $headers = this.headerItems
		const $bodies = this.bodyItems

		if (!$headers.length || !$bodies.length) {
			return
		}

		for (const $item of [...$headers, ...$bodies]) {
			const isValidState = Object.values(STATE).includes($item.dataset.state)

			if (!isValidState) {
				$item.dataset.state = STATE.CLOSED
			}
		}

		const openedIndex = $headers.findIndex($item => $item.dataset.state === STATE.OPENED)
		const nextIndex = openedIndex >= 0 && openedIndex < $bodies.length ? openedIndex : 0

		this.changeTab(nextIndex, false)
	}

	#setupListeners() {
		for (const $handler of this.handlers) {
			$handler.addEventListener('click', () => {
				const $item = $handler.closest(this.selectors.item)
				const index = this.headerItems.indexOf($item)

				if (!$item || !this.$root.contains($item) || index < 0) {
					return
				}

				this.changeTab(index)
			})
		}
	}

	#setupPopstateListener() {
		window.addEventListener('popstate', event => {
			const { state } = event

			if (!state || state.source !== HISTORY.SOURCE) {
				return
			}

			if (typeof state.hash === 'string') {
				const $item = this.headerItems.find($el => $el.dataset.hash === state.hash)
				const index = this.headerItems.indexOf($item)

				if (!$item || index < 0) {
					return
				}

				this.changeTab(index, false)
				return
			}

			if (typeof state.index !== 'number') {
				return
			}

			this.changeTab(state.index, false)
		})
	}

	#setupWindowLoadListener() {
		window.addEventListener('load', () => {
			this.#changeByHash(window.location.hash, false)
		})

		if (document.readyState === 'complete') {
			this.#changeByHash(window.location.hash, false)
		}
	}

	#changeByHash(hash, changeHash = true) {
		if (!hash) {
			return
		}

		const cleanHash = hash.replace('#', '')
		const $item = this.headerItems.find($el => $el.dataset.hash === cleanHash)
		const index = this.headerItems.indexOf($item)

		if (!$item || index < 0) {
			return
		}

		this.changeTab(index, changeHash)
	}

	changeTab(index, changeHash = true) {
		const $headers = this.headerItems
		const $bodies = this.bodyItems

		if (!$headers.length || !$bodies.length || index < 0 || index >= $headers.length || index >= $bodies.length) {
			return
		}

		$headers.forEach(($item, key) => {
			$item.dataset.state = key === index ? STATE.OPENED : STATE.CLOSED
		})

		$bodies.forEach(($item, key) => {
			$item.dataset.state = key === index ? STATE.OPENED : STATE.CLOSED
		})

		if (this.options.useHashNav && changeHash && Object.hasOwn($headers[index].dataset, 'hash')) {
			window.history.pushState(
				{
					source: HISTORY.SOURCE,
					hash: $headers[index].dataset.hash,
					index,
				},
				null,
				`${window.location.pathname}#${$headers[index].dataset.hash}`,
			)
		}

		emitEvent(EVENT.CHANGE, {
			root: this.$root,
			index,
			headerItem: $headers[index],
			bodyItem: $bodies[index],
		})
	}
}
