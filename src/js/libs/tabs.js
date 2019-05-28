class Tabs {
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

		document.addEventListener('click', e => {
			if (e.target.matches(`${this.options.root} ${this.options.title} ${this.options.item}`)) {
				const $elRoot = e.target.closest(this.options.root)
				const $elTitles = $elRoot.querySelectorAll(`${this.options.title} ${this.options.item}`)

				this.change($elRoot, Array.from($elTitles).indexOf(e.target))
			}
		})

		// document.querySelectorAll(this.options.root).forEach($elRoot => {
		// 	const $elTitles = $elRoot.querySelectorAll(`${this.options.title} ${this.options.item}`)

		// 	$elTitles.forEach($elItem => {
		// 		$elItem.addEventListener('click', e => {
		// 			this.change($elRoot, Array.from($elTitles).indexOf($elItem))
		// 		})
		// 	})
		// })

	}

	change($elRoot, index) {
		$elRoot.querySelectorAll(`${this.options.title} ${this.options.item}`).forEach(($el, key) => {
			$el.classList[(key === index ? 'add' : 'remove')](this.options.active)
		})

		$elRoot.querySelectorAll(`${this.options.content} ${this.options.item}`).forEach(($el, key) => {
			$el.classList[(key === index ? 'add' : 'remove')](this.options.active)
		})

		window.dispatchEvent(new CustomEvent('tabChange', {
			bubbles: true,
			detail: {
				root: $elRoot,
				index: index
			}
		}))
	}
}

export default Tabs
