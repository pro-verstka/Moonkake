const STATE = {
	MIN: 'min',
	MAX: 'max',
	NORMAL: 'normal',
	EMPTY: 'empty',
}

export class Counter {
	constructor(options = {}) {
		this.options = {
			selectors: {
				root: '[data-counter]',
				input: '[data-counter-input]',
				plus: '[data-counter-plus]',
				minus: '[data-counter-minus]',
			},
			minValue: 1,
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
		this.regex = /[^0-9]/gim

		this.#init()
	}

	#init() {
		this.#setupInitialState()
		this.#setupListeners()
	}

	#setupInitialState() {
		for (const $root of document.querySelectorAll(this.selectors.root)) {
			const $input = this.#getInputByRoot($root)

			if (!$input) {
				continue
			}

			this.#syncState($root, $input)
		}
	}

	#setupListeners() {
		document.addEventListener('click', this.#onClick.bind(this))
		document.addEventListener('focus', this.#onFocus.bind(this), true)
		document.addEventListener('blur', this.#onBlur.bind(this), true)
		document.addEventListener('keyup', this.#onKeyup.bind(this), true)
	}

	#onClick(event) {
		if (!(event.target instanceof Element)) {
			return
		}

		const $plus = event.target.closest(this.selectors.plus)

		if ($plus) {
			this.#handlePlus($plus)
			return
		}

		const $minus = event.target.closest(this.selectors.minus)

		if ($minus) {
			this.#handleMinus($minus)
		}
	}

	#onFocus(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		this.#handleInputFocus($input)
	}

	#onBlur(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		this.#handleInputBlur($input)
	}

	#onKeyup(event) {
		const $input = this.#getInputByEvent(event)

		if (!$input) {
			return
		}

		this.#handleInputKeyup($input)
	}

	#handlePlus($el) {
		const $root = $el.closest(this.selectors.root)
		const $input = this.#getInputByRoot($root)

		if (!$input || this.#isReadonlyOrDisabled($input)) {
			return
		}

		const { max, prefix, postfix } = this.#getInputMeta($input)
		let value = this.#parseValue($input.value) || 0

		value += 1

		if (max !== null && value >= max) {
			value = max
		}

		this.#setInputValue($input, value, prefix, postfix)
		this.#syncState($root, $input)
		this.#dispatchChange($input)
	}

	#handleMinus($el) {
		const $root = $el.closest(this.selectors.root)
		const $input = this.#getInputByRoot($root)

		if (!$input || this.#isReadonlyOrDisabled($input)) {
			return
		}

		const { min, prefix, postfix } = this.#getInputMeta($input)
		let value = this.#parseValue($input.value) || 0
		const minValue = min === null ? this.options.minValue : min

		value -= 1

		if (value <= minValue) {
			value = minValue
		}

		this.#setInputValue($input, value, prefix, postfix)
		this.#syncState($root, $input)
		this.#dispatchChange($input)
	}

	#handleInputFocus($input) {
		if (this.#isReadonlyOrDisabled($input)) {
			return
		}

		$input.value = this.#extractRawValue($input.value)

		const $root = $input.closest(this.selectors.root)

		if ($root) {
			this.#syncState($root, $input)
		}
	}

	#handleInputBlur($input) {
		if (this.#isReadonlyOrDisabled($input)) {
			return
		}

		const { min, max, prefix, postfix } = this.#getInputMeta($input)
		const minValue = min === null ? this.options.minValue : min
		let value = this.#parseValue($input.value)

		if (!value) {
			value = minValue
		}

		if (min !== null && value < min) {
			value = min
		}

		if (max !== null && value > max) {
			value = max
		}

		setTimeout(() => {
			this.#setInputValue($input, value, prefix, postfix)

			const $root = $input.closest(this.selectors.root)

			if ($root) {
				this.#syncState($root, $input)
			}
		}, 300)
	}

	#handleInputKeyup($input) {
		const value = this.#extractRawValue($input.value)

		$input.value = value

		const $root = $input.closest(this.selectors.root)

		if ($root) {
			this.#syncState($root, $input)
		}
	}

	#getInputByRoot($root) {
		if (!$root) {
			return null
		}

		return $root.querySelector(this.selectors.input)
	}

	#getInputByEvent(event) {
		const $target = event.target

		if (!($target instanceof HTMLInputElement)) {
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

	#getInputMeta($input) {
		return {
			min: this.#toNumberOrNull($input.dataset.min),
			max: this.#toNumberOrNull($input.dataset.max),
			prefix: $input.dataset.prefix || '',
			postfix: $input.dataset.postfix || '',
		}
	}

	#syncState($root, $input) {
		const { min, max } = this.#getInputMeta($input)
		const value = this.#parseValue($input.value)
		const minValue = min === null ? this.options.minValue : min
		let state = STATE.NORMAL

		if (value === null) {
			state = STATE.EMPTY
		} else if (max !== null && value >= max) {
			state = STATE.MAX
		} else if (value <= minValue) {
			state = STATE.MIN
		}

		$root.dataset.state = state
	}

	#dispatchChange($input) {
		$input.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true,
			}),
		)
	}

	#setInputValue($input, value, prefix, postfix) {
		$input.value = `${prefix}${value}${postfix}`
	}

	#isReadonlyOrDisabled($input) {
		return $input.readOnly || $input.disabled
	}

	#extractRawValue(value) {
		return String(value).replace(this.regex, '')
	}

	#parseValue(value) {
		const rawValue = this.#extractRawValue(value)

		if (rawValue === '') {
			return null
		}

		return Number(rawValue)
	}

	#toNumberOrNull(value) {
		if (value === undefined || value === null || value === '') {
			return null
		}

		const numberValue = Number(value)

		if (Number.isNaN(numberValue)) {
			return null
		}

		return numberValue
	}
}
