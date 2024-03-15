export class Select {
	constructor($el) {
		if (!$el) {
			return
		}

		this.$select = $el
		this.$originalSelect = this.$select.querySelector('select')
		this.$options = []

		this.#init()
	}

	#init() {
		this.$select.classList.add('select_initialized')

		this.#buildSelect()
		this.#buildOptions()
		this.#setupState()
		this.#setupCommonListeners()
		this.#setupOptionsListeners()
		this.#setupResetListener()
	}

	#buildSelect() {
		this.$label = document.createElement('div')
		this.$label.classList.add('select__label')

		this.$labelPlaceholder = document.createElement('div')
		this.$labelPlaceholder.classList.add('select__placeholder')

		this.$labelValue = document.createElement('div')
		this.$labelValue.classList.add('select__value')

		this.$dropdown = document.createElement('div')
		this.$dropdown.classList.add('select__dropdown')

		this.$label.appendChild(this.$labelPlaceholder)
		this.$label.appendChild(this.$labelValue)

		this.$select.appendChild(this.$label)
		this.$select.appendChild(this.$dropdown)
	}

	#buildOptions() {
		this.$originalOptions = Array.from(
			this.$originalSelect.querySelectorAll('option'),
		)

		for (const option of this.$originalOptions) {
			const $option = document.createElement('div')
			$option.classList.add('select__option')
			$option.classList.toggle('select__option_selected', option.selected)
			$option.classList.toggle('select__option_disabled', option.disabled)
			$option.classList.toggle(
				'select__option_hidden',
				option.innerText === '' && option.value === '',
			)
			$option.innerHTML = option.innerText
			$option.dataset.value = option.value
			$option.dataset.label = option.innerText
			$option.dataset.disabled = option.disabled
			$option.dataset.selected = option.selected

			this.$options.push($option)
			this.$dropdown.appendChild($option)
		}
	}

	#setupState() {
		this.$select.classList.toggle(
			'select_disabled',
			this.$originalSelect.disabled,
		)
		this.$select.classList.toggle(
			'select_multiple',
			this.$originalSelect.multiple,
		)
		this.$select.classList.toggle(
			'select_touched',
			!!this.$originalSelect.value,
		)

		this.$labelPlaceholder.innerHTML =
			this.$originalSelect.dataset.placeholder || ''
		this.$labelValue.innerHTML =
			this.$originalOptions.filter(
				el =>
					el.value === this.$originalSelect.value ||
					el.innerText === this.$originalSelect.value,
			)[0].innerText ||
			this.$originalSelect.value ||
			''
	}

	#setupCommonListeners() {
		this.$label?.addEventListener('click', e => {
			e.stopPropagation()

			if (this.$originalSelect.disabled) return

			if (!this.$select.classList.contains('select_opened')) {
				Select.closeAll()
			}

			this.$select.classList.toggle('select_opened')
		})

		document.addEventListener('click', () => {
			Select.closeAll()
		})
	}

	#setupOptionsListeners() {
		for (const $option of this.$options) {
			$option.addEventListener('click', () => {
				const { disabled, selected, value, label } = $option.dataset

				if (disabled === 'true' || selected === 'true') return

				this.$labelValue.innerHTML = label

				const $prevOption = this.$options.find(
					$el => $el.dataset.selected === 'true',
				)
				$prevOption.dataset.selected = 'false'
				$prevOption.classList.remove('select__option_selected')

				$option.dataset.selected = 'true'
				$option.classList.add('select__option_selected')

				this.$select.classList.remove('select_opened')
				this.$select.classList.add('select_touched')

				this.$originalSelect.value = value
				this.$originalSelect.dispatchEvent(
					new CustomEvent('change', {
						bubbles: true,
					}),
				)
			})
		}
	}

	#setupResetListener() {
		this.$select?.closest('form')?.addEventListener('reset', () => {
			setTimeout(() => {
				this.update()
			}, 10)
		})
	}

	update() {
		this.$options = []
		this.$dropdown.innerHTML = ''

		this.#buildOptions()
		this.#setupState()
		this.#setupOptionsListeners()
	}

	static closeAll() {
		for (const $select of document.querySelectorAll('.select_opened')) {
			$select.classList.remove('select_opened')
		}
	}
}
