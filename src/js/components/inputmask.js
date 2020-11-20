import IMask from 'imask'

/* IMASK https://imask.js.org/guide.html
-------------------------------------------------- */

const $maskPhone = document.querySelectorAll('input[type="tel"]')

if ($maskPhone.length) {
	$maskPhone.forEach($el => {
		const mask = IMask($el[0], {
			mask: '+{7} (000) 000-00-00',
			lazy: true
		})

		mask.el.input.addEventListener('blur', () => {
			if (!mask.masked.isComplete) mask.value = ''
		})
	})
}

const $maskNumber = document.querySelectorAll('input[data-mask-number]')

if ($maskNumber.length) {
	$maskNumber.forEach($el =>
		IMask($el[0], {
			mask: Number
		})
	)
}

const $maskDate = document.querySelectorAll('input[data-mask-date]')

if ($maskDate.length) {
	$maskDate.forEach($el => {
		const mask = IMask($el[0], {
			mask: Date,
			pattern: 'd{.}`m{.}`Y',
			lazy: false,
			overwrite: true,
			autofix: true,
			blocks: {
				d: { mask: IMask.MaskedRange, placeholderChar: 'д', from: 1, to: 31, maxLength: 2 },
				m: { mask: IMask.MaskedRange, placeholderChar: 'м', from: 1, to: 12, maxLength: 2 },
				Y: { mask: IMask.MaskedRange, placeholderChar: 'г', from: 1900, to: 2999, maxLength: 4 }
			}
		})

		mask.el.input.addEventListener('blur', () => {
			if (!mask.masked.isComplete) mask.value = ''
		})
	})
}
