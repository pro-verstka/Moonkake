export class Counter {
	constructor(options = {}) {
		this.options = {
			root: '.counter',
			plus: '.counter__plus',
			minus: '.counter__minus'
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.regex = /[^0-9]/gim

		this.handle()
	}

	handle() {
		document.addEventListener('click', e => {
			if (e.target.matches(`${this.options.root} ${this.options.plus}`)) {
				this.handlePlus(e.target)
			}

			if (e.target.matches(`${this.options.root} ${this.options.minus}`)) {
				this.handleMinus(e.target)
			}
		})

		document.addEventListener(
			'focus',
			e => {
				if (e.target?.tagName.toLowerCase() === 'input' && e.target.matches(`${this.options.root} input`)) {
					this.handleInputFocus(e.target)
				}
			},
			true
		)

		document.addEventListener(
			'blur',
			e => {
				if (e.target?.tagName.toLowerCase() === 'input' && e.target.matches(`${this.options.root} input`)) {
					this.handleInputBlur(e.target)
				}
			},
			true
		)

		document.addEventListener(
			'keyup',
			e => {
				if (e.target?.tagName.toLowerCase() === 'input' && e.target.matches(`${this.options.root} input`)) {
					this.handleInputKeyup(e.target)
				}
			},
			true
		)
	}

	handlePlus($el) {
		const $input = $el.closest(this.options.root).querySelector('input')
		const max = parseInt($input.dataset.max) || ''
		const prefix = $input.dataset.prefix || ''
		const postfix = $input.dataset.postfix || ''

		let value = $input.value.replace(this.regex, '')
		value = parseInt(value)

		value += 1

		if (max && value >= max) {
			value = max
		}

		$input.value = prefix + value + postfix

		$input.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true
			})
		)
	}

	handleMinus($el) {
		const $input = $el.closest(this.options.root).querySelector('input')
		const min = parseInt($input.dataset.min) || ''
		const prefix = $input.dataset.prefix || ''
		const postfix = $input.dataset.postfix || ''

		let value = $input.value.replace(this.regex, '')
		value = parseInt(value)

		value -= 1

		if (min && value <= min) {
			value = min
		} else if (value <= 1) {
			value = 1
		}

		$input.value = prefix + value + postfix

		$input.dispatchEvent(
			new CustomEvent('change', {
				bubbles: true
			})
		)
	}

	handleInputFocus($input) {
		if ($input.readOnly || $input.disabled) {
			return false
		}

		$input.value = $input.value.replace(this.regex, '')

		return true
	}

	handleInputBlur($input) {
		const min = parseInt($input.dataset.min) || ''
		const max = parseInt($input.dataset.max) || ''
		const prefix = $input.dataset.prefix || ''
		const postfix = $input.dataset.postfix || ''

		if ($input.readOnly || $input.disabled) {
			return false
		}

		let value = $input.value.replace(this.regex, '')
		value = parseInt(value)

		if (!value) {
			if (min) {
				value = min
			} else {
				value = 1
			}
		}

		if (value && min && value < min) {
			value = min
		}

		if (value && max && value > max) {
			value = max
		}

		setTimeout(() => {
			$input.value = prefix + value + postfix
		}, 300)

		return true
	}

	handleInputKeyup($input) {
		let value = $input.value.replace(this.regex, '')
		if (value) value = parseInt(value)

		$input.value = value
	}
}
