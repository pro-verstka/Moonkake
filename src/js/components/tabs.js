const Tabs = class {
	constructor(options = {}) {

		let defaults = {
			root: '.tabs',
			title: '.tabs-title',
			content: '.tabs-content',
			item: '.tabs-item',
			active: '-active'
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		document.querySelectorAll(this.options.root).forEach($elRoot => {
			const $elTitles = $elRoot.querySelectorAll(`${this.options.title} ${this.options.item}`)

			$elTitles.forEach($elItem => {
				$elItem.addEventListener('click', e => {
					this.change($elRoot, Array.from($elTitles).indexOf($elItem))
				})
			})
		})

	}

	change($elRoot, index) {
		const $elTitles = $elRoot.querySelectorAll(`${this.options.title} ${this.options.item}`)
		const $elContents = $elRoot.querySelectorAll(`${this.options.content} ${this.options.item}`)

		$elTitles.forEach(($el, key) => {
			$el.classList[(key === index ? 'add' : 'remove')](this.options.active)
		})

		$elContents.forEach(($el, key) => {
			$el.classList[(key === index ? 'add' : 'remove')](this.options.active)
		})
	}
}

export default Tabs
