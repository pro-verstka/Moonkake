import { emitEvent } from '$helpers'

const STATE = {
	IDLE: 'idle',
	LOADING: 'loading',
}

const EVENT = {
	SELECT: 'mk:autocomplete:select',
}

export class Autocomplete {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$el = $el

		this.options = {
			minLength: 2,
			debounce: 300,
			fetch: null,
			map: null,
			itemTemplate: null,
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
			}
		}

		this.debounceTimer = null
		this.items = []
		this.activeIndex = -1
		this.selectedValue = null
		this.abortController = null
		this.listeners = []

		this.#init()
	}

	#init() {
		this.#buildDropdown()
		this.#setupListeners()
	}

	#buildDropdown() {
		this.$input = this.$el.querySelector('input')
		this.$dropdown = document.createElement('div')
		this.$dropdown.classList.add('autocomplete__dropdown')
		this.$el.appendChild(this.$dropdown)
	}

	#setupListeners() {
		const onInput = e => this.#onInput(e)
		const onKeydown = e => this.#onKeydown(e)
		const onDocClick = e => {
			if (!this.$el.contains(e.target)) this.#close()
		}
		const onReset = () => {
			this.$input.value = ''
			this.selectedValue = null
			this.$el.dataset.value = ''
			this.#close()
		}

		this.$input.addEventListener('input', onInput)
		this.$input.addEventListener('keydown', onKeydown)
		document.addEventListener('click', onDocClick)

		this.listeners.push(
			{ target: this.$input, type: 'input', fn: onInput },
			{ target: this.$input, type: 'keydown', fn: onKeydown },
			{ target: document, type: 'click', fn: onDocClick },
		)

		const form = this.$el.closest('form')

		if (form) {
			form.addEventListener('reset', onReset)
			this.listeners.push({ target: form, type: 'reset', fn: onReset })
		}
	}

	#onInput(e) {
		const query = e.target.value

		if (this.selectedValue !== null) {
			this.selectedValue = null
			this.$el.dataset.value = ''
		}

		clearTimeout(this.debounceTimer)

		if (query.length < this.options.minLength) {
			this.#close()
			return
		}

		this.debounceTimer = setTimeout(() => {
			this.#search(query)
		}, this.options.debounce)
	}

	#onKeydown(e) {
		if (!this.$el.classList.contains('autocomplete_open')) return

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				this.#highlight(Math.min(this.activeIndex + 1, this.items.length - 1))
				break
			case 'ArrowUp':
				e.preventDefault()
				this.#highlight(Math.max(this.activeIndex - 1, 0))
				break
			case 'Enter':
				e.preventDefault()
				if (this.activeIndex >= 0) {
					this.#selectItem(this.items[this.activeIndex])
				}
				break
			case 'Escape':
				this.#close()
				break
		}
	}

	async #search(query) {
		this.abortController?.abort()
		this.abortController = new AbortController()

		this.$el.dataset.state = STATE.LOADING

		try {
			const data = await this.options.fetch(query, this.abortController.signal)
			const items = this.options.map(data)
			this.#renderItems(items)
		} catch (err) {
			if (err.name !== 'AbortError') {
				this.#renderItems([])
			}
		} finally {
			if (this.$el.dataset.state === STATE.LOADING) {
				this.$el.dataset.state = STATE.IDLE
			}
		}
	}

	#renderItems(items) {
		this.items = items
		this.activeIndex = -1
		this.$dropdown.innerHTML = ''

		for (const item of items) {
			const $option = document.createElement('div')
			$option.classList.add('autocomplete__option')

			if (this.options.itemTemplate) {
				const content = this.options.itemTemplate(item)
				if (content instanceof HTMLElement) {
					$option.appendChild(content)
				} else {
					$option.innerHTML = content
				}
			} else {
				$option.textContent = item.label
			}

			$option.addEventListener('click', () => this.#selectItem(item))
			this.$dropdown.appendChild($option)
		}

		if (items.length > 0) {
			this.$el.classList.add('autocomplete_open')
		} else {
			this.#close()
		}

		this.$el.dataset.state = STATE.IDLE
	}

	#highlight(index) {
		const $options = this.$dropdown.querySelectorAll('.autocomplete__option')

		for (const $opt of $options) {
			$opt.classList.remove('autocomplete__option_active')
		}

		if (index >= 0 && index < $options.length) {
			$options[index].classList.add('autocomplete__option_active')
			$options[index].scrollIntoView({ block: 'nearest' })
		}

		this.activeIndex = index
	}

	#selectItem(item) {
		this.$input.value = item.label
		this.selectedValue = item.value
		this.$el.dataset.value = item.value
		this.#close()
		emitEvent(EVENT.SELECT, { label: item.label, value: item.value }, this.$el)
	}

	#close() {
		this.$el.classList.remove('autocomplete_open')
		this.activeIndex = -1
	}

	destroy() {
		clearTimeout(this.debounceTimer)
		this.abortController?.abort()

		for (const { target, type, fn } of this.listeners) {
			target.removeEventListener(type, fn)
		}

		this.$dropdown.remove()
	}
}
