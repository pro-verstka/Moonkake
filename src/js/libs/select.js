/* TODO
	1. Триггер на оригинальный селект
	2. Мультиселект
 */

export default class Select {
	constructor(selector = 'select', options = {}) {
		this.$el = document.querySelector(selector)
		this.options = {}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		this.getData()
		this.renderRoot()
		this.renderList()
		this.setListeners()
		this.watchSelect()
		this.selectValue(this.selected.value)
	}

	get selected() {
		return this.data.find(item => item.selected)
	}

	getData() {
		const $options = this.$el.querySelectorAll('option')

		this.data = Array.from($options).map(el => {
			const label = el.innerText
			const { selected = false, disabled = false, value = label } = el

			return {
				label,
				value,
				selected,
				disabled
			}
		})
	}

	renderRoot() {
		this.$el.classList.add('select-hidden')

		// wrapper
		this.$wrapper = document.createElement('div')
		this.$wrapper.classList.add('select')

		if (this.$el.disabled) {
			this.$wrapper.classList.add('select--disabled')
		}

		// placeholder
		this.$placeholder = document.createElement('div')
		this.$placeholder.classList.add('select-placeholder')

		// dropdown
		this.$dropdown = document.createElement('div')
		this.$dropdown.classList.add('select-dropdown')

		// replace
		this.$wrapper.insertAdjacentElement('beforeend', this.$placeholder)
		this.$wrapper.insertAdjacentElement('beforeend', this.$dropdown)

		this.$el.parentNode.insertBefore(this.$wrapper, this.$el)
		this.$wrapper.appendChild(this.$el)
	}

	renderList() {
		this.$options = []

		this.data.forEach((el, idx) => {
			const $option = document.createElement('div')
			$option.classList.add('select-option')

			if (el.selected) $option.classList.add('select-option--selected')
			if (el.disabled) $option.classList.add('select-option--disabled')

			$option.innerText = el.label

			this.$dropdown.insertAdjacentElement('beforeend', $option)

			this.$options[idx] = $option
		})
	}

	selectValue(value) {
		this.data = this.data.map(item => ({
			...item,
			selected: item.value === value
		}))

		const selectedIndex = this.data.indexOf(this.selected)

		this.$options.forEach(($el, idx) => $el.classList.toggle('select-option--selected', idx === selectedIndex))

		this.$placeholder.innerText = this.selected.label
		this.$el[0].value = this.selected.value
		this.$el[0].dispatchEvent(new Event('change'))
	}

	open() {
		this.$wrapper.classList.add('select--opened')
	}

	close() {
		this.$wrapper.classList.remove('select--opened')
	}

	toggle() {
		this.$wrapper.classList.toggle('select--opened')
	}

	setDisabled(disabled) {
		this.$wrapper.classList.toggle('select--disabled', disabled)
		this.$el[0].disabled = disabled
	}

	setListeners() {
		this.$placeholder.addEventListener('click', () => {
			this.toggle()
		})

		this.$options.forEach(($option, idx) => {
			$option.addEventListener('click', () => {
				this.selectValue(this.data[idx].value)
				this.close()
			})
		})

		document.addEventListener('click', e => {
			if (!e.target.closest('.select') && this.$wrapper.classList.contains('select--opened')) {
				this.close()
			}
		})
	}

	watchSelect() {
		this.$el.addEventListener('change', e => {
			this.setDisabled(e.target.disabled)
			this.selectValue(e.target.value)
		})
	}
}
