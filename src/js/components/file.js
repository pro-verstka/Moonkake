export class File {
	constructor($el) {
		if (!$el) {
			return
		}

		this.$root = $el
		this.$input = this.$root.querySelector('input')
		this.$value = this.$root.querySelector('.field-file__value')

		this.#init()
	}

	#init() {
		this.#setupListeners()
	}

	#setupListeners() {
		this.$input.addEventListener('change', this.#onChangeHandler.bind(this))
	}

	#onChangeHandler(event) {
		const file = event.target.files[0]

		if (!file) {
			this.$root.classList.remove('field-file_active')
		} else {
			this.$root.classList.add('field-file_active')
			this.$value.innerText = file.name
		}
	}
}
