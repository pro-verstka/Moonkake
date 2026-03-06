import { emitEvent } from '$helpers'

const STATE = {
	ACTIVE: 'active',
	INACTIVE: 'inactive',
}

const EVENT = {
	TOGGLE: 'mk:toggler:toggle',
	OPEN: 'mk:toggler:open',
	CLOSE: 'mk:toggler:close',
}

export class Toggler {
	static instances = []

	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$trigger = $el

		this.options = {
			selectors: {
				close: '[data-toggler-close]',
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
		this.targetId = this.$trigger.dataset.toggler || ''
		this.$target = this.targetId ? document.getElementById(this.targetId) : null

		if (!this.targetId || !this.$target) {
			return
		}

		Toggler.instances.push(this)

		this.#init()
	}

	#init() {
		this.#setupInitialState()
		this.#enrichElements()
		this.#setupListeners()
	}

	get $closeButtons() {
		return document.querySelectorAll(`${this.selectors.close}[data-toggler-close="${this.targetId}"]`)
	}

	get isActive() {
		return this.$target.dataset.state === STATE.ACTIVE
	}

	#setupInitialState() {
		const triggerState = this.$trigger.dataset.state
		const targetState = this.$target.dataset.state
		const isValidTriggerState = Object.values(STATE).includes(triggerState)
		const isValidTargetState = Object.values(STATE).includes(targetState)
		const nextState = triggerState === STATE.ACTIVE || targetState === STATE.ACTIVE ? STATE.ACTIVE : STATE.INACTIVE

		if (!isValidTriggerState || !isValidTargetState) {
			this.#setState(nextState)
			return
		}

		this.#setState(nextState)
	}

	#enrichElements() {
		this.$trigger.toggleToggler = () => this.toggle()
		this.$trigger.openToggler = () => this.open()
		this.$trigger.closeToggler = () => this.close()

		this.$target.toggleToggler = () => this.toggle()
		this.$target.openToggler = () => this.open()
		this.$target.closeToggler = () => this.close()
	}

	#setupListeners() {
		this.$trigger.addEventListener('click', event => {
			event.preventDefault()
			this.toggle()
		})

		for (const $button of this.$closeButtons) {
			$button.addEventListener('click', event => {
				event.preventDefault()
				this.close()
			})
		}
	}

	#setState(state) {
		this.$trigger.dataset.state = state
		this.$target.dataset.state = state

		for (const $button of this.$closeButtons) {
			$button.dataset.state = state
		}
	}

	#closeOthers() {
		for (const instance of Toggler.instances) {
			if (instance === this) {
				continue
			}

			instance.close(false)
		}
	}

	toggle() {
		if (this.isActive) {
			this.close()
			return
		}

		this.open()
	}

	open(emit = true) {
		if (this.isActive) {
			return
		}

		this.#closeOthers()
		this.#setState(STATE.ACTIVE)

		if (!emit) {
			return
		}

		emitEvent(EVENT.OPEN, {
			trigger: this.$trigger,
			target: this.$target,
			state: STATE.ACTIVE,
		})

		emitEvent(EVENT.TOGGLE, {
			trigger: this.$trigger,
			target: this.$target,
			state: STATE.ACTIVE,
		})
	}

	close(emit = true) {
		if (!this.isActive) {
			this.#setState(STATE.INACTIVE)
			return
		}

		this.#setState(STATE.INACTIVE)

		if (!emit) {
			return
		}

		emitEvent(EVENT.CLOSE, {
			trigger: this.$trigger,
			target: this.$target,
			state: STATE.INACTIVE,
		})

		emitEvent(EVENT.TOGGLE, {
			trigger: this.$trigger,
			target: this.$target,
			state: STATE.INACTIVE,
		})
	}

	static syncAll() {
		const activeInstances = Toggler.instances.filter(instance => instance.isActive)

		if (!activeInstances.length) {
			for (const instance of Toggler.instances) {
				instance.close(false)
			}

			return
		}

		const [currentInstance] = activeInstances
		currentInstance.open(false)
		for (const instance of activeInstances.slice(1)) {
			instance.close(false)
		}
	}
}
