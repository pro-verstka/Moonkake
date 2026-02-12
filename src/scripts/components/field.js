const STATE = {
	FOCUS: 'focus',
	TOUCHED: 'touched',
	EMPTY: 'empty',
}

const VALIDATION_STATE = {
	DEFAULT: 'default',
	ERROR: 'error',
	SUCCESS: 'success',
}

export class Field {
	constructor(options = {}) {
		this.options = {
			selectors: {
				root: '[data-field]',
				input: '[data-field-input]',
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
		this.$fields = []

		this.#init()
	}

	#init() {
		this.#setListeners()
		this.update()
	}

	#setListeners() {
		document.addEventListener('focus', this.#onFocus.bind(this), true)
		document.addEventListener('blur', this.#onBlur.bind(this), true)
		document.addEventListener('input', this.#onInput.bind(this), true)
	}

	#onFocus(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		const $field = $input.closest(this.selectors.root)

		if (!$field) {
			return
		}

		$field.dataset.state = STATE.FOCUS
	}

	#onBlur(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		const $field = $input.closest(this.selectors.root)

		if (!$field) {
			return
		}

		if ($input.value === '') {
			$field.dataset.state = STATE.EMPTY
			$field.dataset.validationState = VALIDATION_STATE.DEFAULT
			return
		}

		$field.dataset.state = STATE.TOUCHED
	}

	#onInput(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		const $field = $input.closest(this.selectors.root)

		if (!$field) {
			return
		}

		$field.dataset.state = $input.value === '' ? STATE.EMPTY : STATE.TOUCHED
		$field.dataset.validationState = VALIDATION_STATE.DEFAULT
	}

	#getInputByEvent(event) {
		const $target = event.target

		if (!($target instanceof HTMLInputElement) && !($target instanceof HTMLTextAreaElement)) {
			return null
		}

		if (!$target.matches(this.selectors.input)) {
			return null
		}

		if (!$target.closest(this.selectors.root)) {
			return null
		}

		return $target
	}

	update() {
		this.$fields = Array.from(document.querySelectorAll(`${this.selectors.root} ${this.selectors.input}`))

		if (!this.$fields.length) {
			return
		}

		for (const $input of this.$fields) {
			const $field = $input.closest(this.selectors.root)

			if (!$field) {
				continue
			}

			$field.dataset.type = $input.type || 'text'
			$field.dataset.state = $input.value !== '' ? STATE.TOUCHED : STATE.EMPTY
			$field.dataset.disabled = String($input.disabled)
			$field.dataset.readonly = String($input.readOnly)
			$field.dataset.required = String($input.required)

			const { validationState } = $field.dataset
			const isValidValidationState = Object.values(VALIDATION_STATE).includes(validationState)

			if (!isValidValidationState) {
				$field.dataset.validationState = VALIDATION_STATE.DEFAULT
			}
		}
	}
}
