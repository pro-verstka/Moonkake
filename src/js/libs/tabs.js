class Tabs {
	constructor(options = {}) {
		this.options = {
			root: '.tabs',
			title: '.tabs-title',
			content: '.tabs-content',
			item: '.tabs-item',
			active: '-active',
			useHashNav: true
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		// tab click
		document.addEventListener('click', e => {
			if (
				e.target.matches(`${this.options.root} ${this.options.title} ${this.options.item}`) ||
				e.target.closest(`${this.options.root} ${this.options.title} ${this.options.item}`)
			) {
				const $root = e.target.closest(this.options.root)
				const $titles = $root.querySelectorAll(`${this.options.title} ${this.options.item}`)

				let $el = e.target.matches(`${this.options.root} ${this.options.title} ${this.options.item}`)
					? e.target
					: e.target.closest(`${this.options.root} ${this.options.title} ${this.options.item}`)

				this.change($root, Array.from($titles).indexOf($el))
			}
		})

		// tab change on history change
		window.addEventListener('popstate', e => {
			if (e.state && e.state.hasOwnProperty('source') && e.state.source == 'tabs') {
				const $root = document
					.querySelector(`${this.options.root} [data-hash="${e.state.hash}"]`)
					.closest(this.options.root)

				this.change($root, e.state.index, false)
			}
		})

		// tab change on window load
		window.addEventListener('load', e => {
			if (window.location.hash) {
				const hash = window.location.hash.substr(1)
				const $title = document.querySelector(`${this.options.root} [data-hash="${hash}"]`)

				if ($title) {
					const $root = $title.closest(this.options.root)
					const $titles = $root.querySelectorAll(`${this.options.title} ${this.options.item}`)

					this.change($root, Array.from($titles).indexOf($title), false)
				}
			}
		})
	}

	change($root, index, changeHash = true) {
		const $titles = $root.querySelectorAll(`${this.options.title} ${this.options.item}`)
		const $contents = $root.querySelectorAll(`${this.options.content} ${this.options.item}`)

		$titles.forEach(($el, key) => {
			$el.classList[key === index ? 'add' : 'remove'](this.options.active)
		})

		$contents.forEach(($el, key) => {
			$el.classList[key === index ? 'add' : 'remove'](this.options.active)
		})

		if (this.options.useHashNav && changeHash && $titles[index].dataset.hasOwnProperty('hash')) {
			window.history.pushState(
				{
					source: 'tabs',
					hash: $titles[index].dataset.hash,
					index: index
				},
				null,
				`${window.location.pathname}#${$titles[index].dataset.hash}`
			)
		}

		window.dispatchEvent(
			new CustomEvent('tabChange', {
				bubbles: true,
				detail: {
					root: $root,
					index: index
				}
			})
		)
	}
}

export default Tabs
