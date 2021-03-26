import validate from 'validate.js'

const schema = {
	email: {
		email: true
	},
	phone: {
		length: {
			is: 18
		}
		// type: 'number'
	}
}

class Field {
	constructor(options = {}) {
		this.options = {
			classNames: {
				root: 'field',
				focus: 'field--focus',
				touched: 'field--touched',
				error: 'field--error',
				success: 'field--success',
				disabled: 'field--disabled',
				readonly: 'field--readonly',
				required: 'field--required'
			}
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.$fields = null

		this.setListeners()
		this.update()
	}

	setListeners() {
		document.addEventListener(
			'focus',
			e => {
				const $el = e.target

				if (!$el.matches(`.${this.options.classNames.root} input`)) return

				$el.closest(`.${this.options.classNames.root}`).classList.add(this.options.classNames.focus)
			},
			true
		)

		document.addEventListener(
			'blur',
			e => {
				const $el = e.target

				if (!$el.matches(`.${this.options.classNames.root} input`)) return

				if ($el.value === '') {
					$el
						.closest(`.${this.options.classNames.root}`)
						.classList.remove(
							this.options.classNames.touched,
							this.options.classNames.error,
							this.options.classNames.success
						)
				} else {
					this.validate($el)
				}

				$el.closest(`.${this.options.classNames.root}`).classList.remove(this.options.classNames.focus)
			},
			true
		)

		document.addEventListener(
			'input',
			e => {
				const $el = e.target

				if (!$el.matches(`.${this.options.classNames.root} input`)) return

				$el.closest(`.${this.options.classNames.root}`).classList.add(this.options.classNames.touched)
				$el
					.closest(`.${this.options.classNames.root}`)
					.classList.remove(this.options.classNames.error, this.options.classNames.success)

				this.validate($el)
			},
			true
		)
	}

	update() {
		this.$fields = document.querySelectorAll(`.${this.options.classNames.root} input`)

		if (this.$fields.length) {
			this.$fields.forEach($el => {
				const $field = $el.closest(`.${this.options.classNames.root}`)
				const classNames = []

				classNames.push(`${this.options.classNames.root}--${$el.type}`)

				if ($el.value !== '') classNames.push(this.options.classNames.touched)
				if ($el.disabled) classNames.push(this.options.classNames.disabled)
				if ($el.readonly) classNames.push(this.options.classNames.readonly)
				if ($el.required) classNames.push(this.options.classNames.required)

				$field.classList.add(...classNames)

				this.validate($el)
			})
		}
	}

	validate($el) {
		if (!$el.value || !schema[$el.name]) return

		const errors = validate.single($el.value, schema[$el.name])
		const $field = $el.closest(`.${this.options.classNames.root}`)

		if (errors) {
			$field.classList.add(this.options.classNames.error)
			$field.classList.remove(this.options.classNames.success)
		} else {
			$field.classList.remove(this.options.classNames.error)
			$field.classList.add(this.options.classNames.success)
		}
	}
}

export default Field
