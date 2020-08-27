/* FILE
-------------------------------------------------- */

document.querySelectorAll('.file').forEach(el => {
	const label = el.querySelector('label span')
	const text = el.dataset.text || 'Выберите файл'

	el.querySelector('input[type="file"]').addEventListener('change', function() {
		let { value } = this

		if (value) {
			value = value.split(/(\\|\/)/g).pop()
		} else {
			value = text
		}

		label.innerText = value
	})
})
