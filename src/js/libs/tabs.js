class Tabs {
	constructor(options = {}) {
		this.options = {
			root: '.tabs',
			title: '.tabs-title',
			content: '.tabs-content',
			item: '.tabs-item',
			active: '-active',
			useHashNav: true,
			equalHeight: true
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

				const $el = e.target.matches(`${this.options.root} ${this.options.title} ${this.options.item}`)
					? e.target
					: e.target.closest(`${this.options.root} ${this.options.title} ${this.options.item}`)

				this.change($root, Array.from($titles).indexOf($el))
			}
		})

		// tab change on history change
		window.addEventListener('popstate', e => {
			if (e.state && Object.prototype.hasOwnProperty.call(e.state, 'source') && e.state.source === 'tabs') {
				const $root = document
					.querySelector(`${this.options.root} [data-hash="${e.state.hash}"]`)
					.closest(this.options.root)

				this.change($root, e.state.index, false)
			}
		})

		// tab change on window load
		window.addEventListener('load', () => {
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

		// set tabs equal height
		if (this.options.equalHeight) {
			this.setEqualHeight()
			;['load', 'resize'].forEach(eventType =>
				window.addEventListener(eventType, () => {
					this.setEqualHeight()
				})
			)
		}
	}

	setEqualHeight() {
		if (!this.options.equalHeight) return false

		document.querySelectorAll(this.options.root).forEach($root => {
			const $content = $root.querySelector(this.options.content)
			const $contents = $content.querySelectorAll(this.options.item)
			const heights = []

			$content.style.minHeight = ''

			$contents.forEach($el => {
				if (!$el.classList.contains(this.options.active)) {
					$el.style.display = 'block'
					heights.push($el.clientHeight)
					$el.style.display = ''
				} else {
					heights.push($el.clientHeight)
				}
			})

			$content.style.minHeight = `${Math.max(...heights)}px`
		})

		return true
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

		if (this.options.useHashNav && changeHash && Object.prototype.hasOwnProperty.call($titles[index].dataset, 'hash')) {
			window.history.pushState(
				{
					source: 'tabs',
					hash: $titles[index].dataset.hash,
					index
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
					index
				}
			})
		)
	}
}

export default Tabs
