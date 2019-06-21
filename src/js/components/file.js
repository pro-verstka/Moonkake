/* FILE
-------------------------------------------------- */

document.querySelectorAll('.file').forEach(el => {
	let label = el.querySelector('label span')
	let text = el.dataset.text || 'Выберите файл'

	el.querySelector('input[type="file"]').addEventListener('change', function() {
		let value = this.value

		if (value) {
			value = value.split(/(\\|\/)/g).pop()
		} else {
			value = text
		}

		label.innerText = value
	})
})
