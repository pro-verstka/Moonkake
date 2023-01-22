// eslint-disable-next-line max-classes-per-file
import { emitEvent } from '../helpers'

class Select {
	$originalSelect = null

	$originalOptions = []

	$select = null

	$label = null

	$labelPlaceholder = null

	$labelValue = null

	$dropdown = null

	$options = []

	constructor($select, config = {}) {
		this.$select = $select

		if (!this.$select) return

		this.config = {
			...config
		}

		this.$originalSelect = this.$select.querySelector('select')

		this.#init()
	}

	#init() {
		this.#buildSelect()
		this.#buildOptions()
		this.#setupState()
		this.#handleCommonEvents()
		this.#handleOptionsEvents()
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
		this.$originalOptions = Array.from(this.$originalSelect.querySelectorAll('option'))

		this.$originalOptions?.forEach(option => {
			const $option = document.createElement('div')
			$option.classList.add('select__option')
			$option.classList.toggle('select__option_selected', option.selected)
			$option.classList.toggle('select__option_disabled', option.disabled)
			$option.classList.toggle('select__option_hidden', option.innerText === '' && option.value === '')
			$option.innerHTML = option.innerText
			$option.dataset.value = option.value
			$option.dataset.label = option.innerText
			$option.dataset.disabled = option.disabled
			$option.dataset.selected = option.selected

			this.$options.push($option)
			this.$dropdown.appendChild($option)
		})
	}

	#setupState() {
		this.$select.classList.toggle('select_disabled', this.$originalSelect.disabled)
		this.$select.classList.toggle('select_multiple', this.$originalSelect.multiple)

		this.$labelPlaceholder.innerHTML = this.$originalSelect.dataset.placeholder || ''
		this.$labelValue.innerHTML =
			this.$originalOptions.filter(
				el => el.value === this.$originalSelect.value || el.innerText === this.$originalSelect.value
			)[0].innerText ||
			this.$originalSelect.value ||
			''
	}

	#handleCommonEvents() {
		this.$label?.addEventListener('click', e => {
			e.stopPropagation()

			this.closeAll()

			if (this.$originalSelect.disabled) return

			this.$select.classList.toggle('select_opened')
		})
	}

	#handleOptionsEvents() {
		this.$options?.forEach($option => {
			$option.addEventListener('click', () => {
				const { disabled, selected, value, label } = $option.dataset

				if (disabled === 'true' || selected === 'true') return

				this.$labelValue.innerHTML = label

				const $prevOption = this.$options.find($el => $el.dataset.selected === 'true')
				$prevOption.dataset.selected = 'false'
				$prevOption.classList.remove('select__option_selected')

				$option.dataset.selected = 'true'
				$option.classList.add('select__option_selected')

				this.$select.classList.remove('select_opened')
				this.$select.classList.add('select_touched')

				this.$originalSelect.value = value

				emitEvent('change', {}, this.$originalSelect)
			})
		})
	}

	update() {
		this.$options = []
		this.$dropdown.innerHTML = ''

		this.#buildOptions()
		this.#setupState()
		this.#handleOptionsEvents()
	}

	// eslint-disable-next-line class-methods-use-this
	closeAll() {
		document.querySelectorAll('.select_opened')?.forEach($select => {
			$select.classList.remove('select_opened')
		})
	}
}

class CustomSelect {
	constructor(selector = '.select', config = {}) {
		this.selector = selector
		this.$selects = []

		document.querySelectorAll(selector).forEach($select => {
			const select = new Select($select, config)

			this.$selects.push(select)
		})

		this.#init()
	}

	#init() {
		this.#handleEvents()
	}

	// eslint-disable-next-line class-methods-use-this
	#handleEvents() {
		document.addEventListener('click', () => {
			this.$selects[0].closeAll()
		})
	}

	update() {
		this.$selects.forEach(select => {
			select.update()
		})
	}
}

export default CustomSelect
