import validate from 'validate.js'

const isEmpty = obj => obj && Object.keys(obj).length === 0 && obj.constructor === Object

const defaultSchema = {
	email: {
		email: true,
	},
	phone: {
		length: {
			is: 18,
		},
	},
}

export class Validation {
	constructor(selector = 'form', schema = {}, options = {}) {
		if (typeof selector !== 'string') {
			console.error('[Validation] Selector must be string')
			return
		}

		this.$form = document.querySelector(selector)

		if (!this.$form) {
			console.error('[Validation] Form not found')
			return
		}

		this.options = {
			selectors: 'input, select, textarea',
			events: 'change, input, blur',
			classNames: {
				root: 'field',
				error: 'field_error',
				success: 'field_success',
			},
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.schema = !isEmpty(schema) ? schema : defaultSchema

		this.#addListeners()
	}

	#addListeners() {
		for (const $field of this.$form.querySelectorAll(this.options.selectors)) {
			const events = this.options.events.split(',')

			for (const event of events) {
				$field.addEventListener(event, this.validate($field).bind(this))
			}
		}
	}

	validate($el) {
		if (!this.schema[$el.name]) return

		const values = validate.collectFormValues(this.$form)
		const errors = validate.single(values[$el.name], this.schema[$el.name])

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
