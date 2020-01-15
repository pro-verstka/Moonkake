class Spoiler {
	constructor(options = {}) {
		let defaults = {
			rootSelector: '[data-spoiler]',
			bodySelector: '[data-spoiler-body]',
			introSelector: '[data-spoiler-intro]',
			toggleSelector: '[data-spoiler-toggle]',
			mode: 'text', //text, html
			trim: 100,
			postfix: '...',
			labels: ['Показать', 'Скрыть']
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		this.$elements = document.querySelectorAll(`${this.options.rootSelector}:not(.-initialized)`)
		this.handle(this.$elements)
	}

	handle($elements) {
		if ($elements.length) {
			if (this.options.mode === 'text') {
				this.handleTextMode($elements)
			}

			if (this.options.mode === 'html') {
				this.handleHtmlMode($elements)
			}
		}
	}

	handleHtmlMode($elements) {
		$elements.forEach($spoiler => {
			$spoiler.classList.add('spoiler')
			$spoiler.classList.add('spoiler--custom')
			$spoiler.classList.add('spoiler--html-mode')
			$spoiler.classList.add('-initialized')

			const $body = $spoiler.querySelector(this.options.bodySelector)
			const $toggle = this.createToggle()

			$spoiler.insertBefore($toggle, $body.nextSibling)

			this.handleToggle($toggle, $spoiler)
		})
	}

	handleTextMode($elements) {
		$elements.forEach($spoiler => {
			$spoiler.classList.add('spoiler')
			$spoiler.classList.add('spoiler--custom')
			$spoiler.classList.add('spoiler--text-mode')
			$spoiler.classList.add('-initialized')

			const $body = $spoiler.querySelector(this.options.bodySelector)

			const text = $body.textContent.trim()

			if (text.length > this.options.trim) {
				const $intro = this.createIntro(text.slice(0, this.options.trim))
				const $toggle = this.createToggle()

				$spoiler.insertBefore($intro, $body)
				$spoiler.insertBefore($toggle, $body.nextSibling)

				this.handleToggle($toggle, $spoiler)
			}
		})
	}

	handleNew() {
		const $new = document.querySelectorAll(`${this.options.rootSelector}:not(.-initialized)`)

		this.$elements = [...$new, this.$elements]

		this.handle($new)
	}

	createToggle() {
		const $toggle = document.createElement('button')
		$toggle.setAttribute('data-spoiler-toggle', '')
		$toggle.innerText = this.options.labels[0]

		return $toggle
	}

	createIntro(text) {
		const $intro = document.createElement('div')
		$intro.setAttribute('data-spoiler-intro', '')
		$intro.innerHTML = `${text}${this.options.postfix}`

		return $intro
	}

	handleToggle($toggle, $spoiler) {
		let labels = this.options.labels

		$toggle.addEventListener('click', e => {
			e.preventDefault()
			$spoiler.classList.toggle('-active')
			$toggle.innerHTML = labels.reverse()[0]
		})
	}
}

export default Spoiler
