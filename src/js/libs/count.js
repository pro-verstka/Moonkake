class Counter {
	constructor(options = {}) {
		let defaults = {
			root: '.counter',
			plus: '.counter-plus',
			minus: '.counter-minus'
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		document.querySelectorAll(this.options.root).forEach(el => {
			let input = el.querySelector('input')
			let min = input.dataset.min || ''
			let max = input.dataset.max || ''
			let postfix = input.dataset.postfix || ''

			el.querySelector(this.options.plus).addEventListener('click', function () {
				let value = parseInt(input.value)

				value += 1

				if (max && value >= max) {
					value = max
				}

				input.value = value + postfix
				input.dispatchEvent(new CustomEvent('change', {
					'bubbles': true
				}))
			})

			el.querySelector(this.options.minus).addEventListener('click', function () {
				let value = parseInt(input.value)

				value -= 1

				if (min && value <= min) {
					value = min
				} else if (value <= 1) {
					value = 1
				}

				input.value = value + postfix
				input.dispatchEvent(new CustomEvent('change', {
					'bubbles': true
				}))
			})

			input.addEventListener('focus', function () {
				if (this.readOnly || this.disabled) {
					return false
				}

				let value = input.value.replace(/[^0-9]/gim, '')

				input.value = value
			})

			input.addEventListener('blur', function () {
				if (this.readOnly || this.disabled) {
					return false
				}

				let value = this.value

				if (value === '' || value === '0') {
					if (min) {
						value = min
					} else {
						value = 1
					}
				}

				this.value = value + postfix
			})

			input.addEventListener('keyup', function () {
				let value = input.value.replace(/[^0-9]/gim, '')

				input.value = value
			})

		})

	}
}

export default Counter
