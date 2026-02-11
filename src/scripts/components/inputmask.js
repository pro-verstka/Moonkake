import IMask from 'imask'

export class InputMask {
	constructor() {
		this.#init()
	}

	#init() {
		this.#initMask()
	}

	#initMask() {
		for (const $el of document.querySelectorAll('input[type="tel"]')) {
			const mask = IMask($el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true,
			})

			mask.el.input.addEventListener('focus', () => {
				mask.updateOptions({
					lazy: false,
				})
			})

			mask.el.input.addEventListener('blur', () => {
				if (!mask.masked.isComplete) mask.value = ''

				mask.updateOptions({
					lazy: true,
				})
			})
		}

		for (const $el of document.querySelectorAll('input[data-mask-number]')) {
			IMask($el, {
				mask: Number,
			})
		}

		for (const $el of document.querySelectorAll('input[data-mask-date]')) {
			const mask = IMask($el, {
				mask: Date,
				pattern: 'd{.}`m{.}`Y',
				lazy: false,
				overwrite: true,
				autofix: true,
				blocks: {
					d: {
						mask: IMask.MaskedRange,
						placeholderChar: 'д',
						from: 1,
						to: 31,
						maxLength: 2,
					},
					m: {
						mask: IMask.MaskedRange,
						placeholderChar: 'м',
						from: 1,
						to: 12,
						maxLength: 2,
					},
					Y: {
						mask: IMask.MaskedRange,
						placeholderChar: 'г',
						from: 1900,
						to: 2999,
						maxLength: 4,
					},
				},
			})

			mask.el.input.addEventListener('blur', () => {
				if (!mask.masked.isComplete) mask.value = ''
			})
		}
	}
}
