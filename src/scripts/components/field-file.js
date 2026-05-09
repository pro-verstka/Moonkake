const STATE = {
	FILLED: 'filled',
	EMPTY: 'empty',
}

const DRAG_STATE = {
	OVER: 'over',
	IDLE: 'idle',
}

/**
 * File field state and selected file name renderer.
 *
 * Markup:
 * <label data-file>
 *   <input data-file-input type="file" multiple>
 *   <span data-file-value></span>
 * </label>
 *
 * Sets `data-state="empty"|"filled"` and `data-drag-state="idle"|"over"` on the root.
 *
 * @example
 * document.querySelectorAll('[data-file]').forEach($el => new FieldFile($el))
 *
 * new FieldFile(document.querySelector('[data-file]'), {
 *   useDragAndDrop: false,
 * })
 */
export class FieldFile {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			selectors: {
				input: '[data-file-input]',
				value: '[data-file-value]',
			},
			useDragAndDrop: true,
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

		this.selectors = this.options.selectors

		this.$input = this.$root.querySelector(this.selectors.input)
		this.$value = this.$root.querySelector(this.selectors.value)
		this.dragDepth = 0

		if (!this.$input) {
			return
		}

		this.#init()
	}

	#init() {
		this.#setupState()
		this.#setDragState(false)
		this.#setupListeners()

		if (this.options.useDragAndDrop) {
			this.#setupDragAndDropListeners()
		}
	}

	#setupListeners() {
		this.$input.addEventListener('change', event => {
			this.#setupState(event.target.files)
		})
	}

	#setupDragAndDropListeners() {
		this.$root.addEventListener('dragenter', event => {
			event.preventDefault()
			event.stopPropagation()

			this.dragDepth += 1
			this.#setDragState(true)
		})

		this.$root.addEventListener('dragover', event => {
			event.preventDefault()
			event.stopPropagation()

			this.#setDragState(true)
		})

		this.$root.addEventListener('dragleave', event => {
			event.preventDefault()
			event.stopPropagation()

			this.dragDepth = Math.max(0, this.dragDepth - 1)

			if (this.dragDepth === 0) {
				this.#setDragState(false)
			}
		})

		this.$root.addEventListener('drop', event => {
			event.preventDefault()
			event.stopPropagation()

			this.dragDepth = 0
			this.#setDragState(false)

			const files = event.dataTransfer?.files

			if (!files?.length) {
				return
			}

			const isSyncedToInput = this.#setInputFiles(files)

			if (!isSyncedToInput) {
				this.#setupState(files)
			}
		})
	}

	#setInputFiles(files) {
		try {
			this.$input.files = files
			this.$input.dispatchEvent(
				new CustomEvent('change', {
					bubbles: true,
				}),
			)
			return true
		} catch {
			// Some browsers do not allow assigning FileList programmatically.
			return false
		}
	}

	#setDragState(isDragOver) {
		const dragState = isDragOver ? DRAG_STATE.OVER : DRAG_STATE.IDLE
		this.$root.dataset.dragState = dragState
	}

	#setupState(files = this.$input.files) {
		const fileList = Array.from(files || [])
		const hasFiles = fileList.length > 0

		this.$root.dataset.state = hasFiles ? STATE.FILLED : STATE.EMPTY

		if (this.$value) {
			this.$value.innerText = hasFiles ? fileList.map(file => file.name).join(', ') : ''
		}
	}
}
