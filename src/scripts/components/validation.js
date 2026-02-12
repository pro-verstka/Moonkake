import validate from 'validate.js'

const isEmpty = obj => obj && Object.keys(obj).length === 0 && obj.constructor === Object

const VALIDATION_STATE = {
	ERROR: 'error',
	SUCCESS: 'success',
}

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
			selectors: {
				fields: 'input, select, textarea',
				root: '[data-field]',
			},
			events: 'change, input, blur',
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

		this.schema = !isEmpty(schema) ? schema : defaultSchema

		this.#init()
	}

	#init() {
		this.#setupListeners()
	}

	#setupListeners() {
		for (const $field of this.$form.querySelectorAll(this.options.selectors.fields)) {
			const events = this.options.events.split(',').map(event => event.trim())

			for (const event of events) {
				$field.addEventListener(event, () => {
					this.validate($field)
				})
			}
		}
	}

	validate($el) {
		if (!this.schema[$el.name]) return

		const values = validate.collectFormValues(this.$form)
		const errors = validate.single(values[$el.name], this.schema[$el.name])

		const $field = $el.closest(this.options.selectors.root)

		if (!$field) {
			return
		}

		if (errors) {
			$field.dataset.validationState = VALIDATION_STATE.ERROR
		} else {
			$field.dataset.validationState = VALIDATION_STATE.SUCCESS
		}
	}
}
