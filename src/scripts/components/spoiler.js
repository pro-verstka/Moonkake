export class Spoiler {
	constructor(options = {}) {
		this.options = {
			rootSelector: '[data-spoiler]',
			bodySelector: '[data-spoiler-body]',
			introSelector: '[data-spoiler-intro]',
			toggleSelector: '[data-spoiler-toggle]',
			mode: 'text', // text, html
			trim: 100,
			postfix: '...',
			labels: ['Показать', 'Скрыть'],
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

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
		for (const $spoiler of $elements) {
			$spoiler.classList.add('spoiler')
			$spoiler.classList.add('spoiler_custom')
			$spoiler.classList.add('spoiler_html-mode')
			$spoiler.classList.add('spoiler_initialized')

			const $body = $spoiler.querySelector(this.options.bodySelector)
			const $toggle = this.createToggle()

			$spoiler.insertBefore($toggle, $body.nextSibling)

			this.handleToggle($toggle, $spoiler)
		}
	}

	handleTextMode($elements) {
		for (const $spoiler of $elements) {
			$spoiler.classList.add('spoiler')
			$spoiler.classList.add('spoiler_custom')
			$spoiler.classList.add('spoiler_text-mode')
			$spoiler.classList.add('spoiler_initialized')

			const $body = $spoiler.querySelector(this.options.bodySelector)

			const text = $body.textContent.trim()

			if (text.length > this.options.trim) {
				const $intro = this.createIntro(text.slice(0, this.options.trim))
				const $toggle = this.createToggle()

				$spoiler.insertBefore($intro, $body)
				$spoiler.insertBefore($toggle, $body.nextSibling)

				this.handleToggle($toggle, $spoiler)
			}
		}
	}

	handleNew() {
		const $new = document.querySelectorAll(`${this.options.rootSelector}:not(.spoiler_initialized)`)

		this.$elements = [...$new, this.$elements]

		this.handle($new)
	}

	createToggle() {
		const [label] = this.options.labels
		const $toggle = document.createElement('button')
		$toggle.setAttribute('data-spoiler-toggle', '')
		$toggle.innerText = label

		return $toggle
	}

	createIntro(text) {
		const $intro = document.createElement('div')
		$intro.setAttribute('data-spoiler-intro', '')
		$intro.innerHTML = `${text}${this.options.postfix}`

		return $intro
	}

	handleToggle($toggle, $spoiler) {
		const { labels } = this.options

		$toggle.addEventListener('click', e => {
			e.preventDefault()
			const [label] = labels.reverse()
			$spoiler.classList.toggle('spoiler_active')
			$toggle.innerHTML = label
		})
	}
}
