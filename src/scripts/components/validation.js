/**
 * Form validation.
 *
 * Schema: { [cssSelector]: (value, context) => ({ valid, message }) }
 * context: { values: { [name]: value }, fields: { [name]: HTMLElement }, form }
 *
 * On change/input/blur sets `data-validation-state="success"|"error"` and
 * `data-validation-message` on the closest `[data-field]`.
 *
 * @example
 * new Validation('form', {
 *   '[name="email"]': value => ({
 *     valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
 *     message: 'Invalid email',
 *   }),
 *   '[name="confirmEmail"]': (value, ctx) => ({
 *     valid: value === ctx.values.email,
 *     message: 'Emails do not match',
 *   }),
 * })
 *
 * // On submit:
 * const v = new Validation('form', schema)
 * form.addEventListener('submit', e => {
 *   const { valid, errors } = v.validateAll()
 *   if (!valid) e.preventDefault()
 * })
 *
 * // Render error text via onValidate callback:
 * new Validation('form', schema, {
 *   onValidate: ({ field, valid, message }) => {
 *     const $error = field?.querySelector('[data-field-error]')
 *     if ($error) $error.textContent = valid ? '' : message
 *   },
 * })
 */
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
				root: '[data-field]',
			},
			events: 'change, input, blur',
			onValidate: null,
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
		const events = this.options.events.split(',').map(event => event.trim())

		for (const [fieldSelector, validator] of Object.entries(this.schema)) {
			const $inputs = this.$form.querySelectorAll(fieldSelector)

			for (const $input of $inputs) {
				for (const event of events) {
					$input.addEventListener(event, () => {
						this.#validateField($input, validator)
					})
				}
			}
		}
	}

	#collectContext() {
		const values = {}
		const fields = {}

		for (const $el of this.$form.elements) {
			if (!$el.name) continue

			if ($el.type === 'checkbox' || $el.type === 'radio') {
				if ($el.checked) {
					values[$el.name] = $el.value
				} else if (!($el.name in values)) {
					values[$el.name] = null
				}
			} else {
				values[$el.name] = $el.value
			}

			fields[$el.name] = $el
		}

		return { values, fields, form: this.$form }
	}

	#validateField($input, validator) {
		const context = this.#collectContext()
		const result = validator($input.value, context) || {}
		const valid = Boolean(result.valid)
		const message = result.message || ''

		const $field = $input.closest(this.options.selectors.root)

		if ($field) {
			$field.dataset.validationState = valid ? VALIDATION_STATE.SUCCESS : VALIDATION_STATE.ERROR
			$field.dataset.validationMessage = valid ? '' : message
		}

		if (typeof this.options.onValidate === 'function') {
			this.options.onValidate({ field: $field, input: $input, valid, message })
		}

		return { valid, message }
	}

	validate($input) {
		for (const [fieldSelector, validator] of Object.entries(this.schema)) {
			if ($input.matches(fieldSelector)) {
				return this.#validateField($input, validator)
			}
		}
	}

	validateAll() {
		const errors = {}
		let valid = true

		for (const [fieldSelector, validator] of Object.entries(this.schema)) {
			const $inputs = this.$form.querySelectorAll(fieldSelector)

			for (const $input of $inputs) {
				const result = this.#validateField($input, validator)

				if (!result.valid) {
					valid = false
					errors[fieldSelector] = result.message
				}
			}
		}

		return { valid, errors }
	}
}

const VALIDATION_STATE = {
	ERROR: 'error',
	SUCCESS: 'success',
}

const isEmpty = obj => obj && Object.keys(obj).length === 0 && obj.constructor === Object

const defaultSchema = {
	'[name="email"]': value => {
		const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
		return {
			valid: ok,
			message: ok ? '' : 'Invalid email',
		}
	},
	'[name="phone"]': value => {
		const ok = value.length === 18
		return {
			valid: ok,
			message: ok ? '' : 'Invalid phone length',
		}
	},
}
