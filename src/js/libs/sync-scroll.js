class SyncScroll {
	constructor() {
		this.$root = document.querySelector('[data-sync-scroll]')
		this.$items = this.$root.querySelectorAll('[data-sync-scroll-item]')

		if (!this.$root) {
			return
		}

		this.init()
	}

	init() {
		this.setListeners()
	}

	setListeners() {
		this.$items.forEach(($item, currentIndex) => {
			$item.addEventListener('scroll', () => {
				const { scrollLeft } = $item

				this.$items.forEach(($el, elIndex) => {
					if (elIndex !== currentIndex) {
						$el.scrollLeft = scrollLeft
					}
				})
			})
		})
	}
}

export default SyncScroll
