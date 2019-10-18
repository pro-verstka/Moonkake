class Parallax {
	constructor(options = {}) {
		let defaults = {
			item: '[data-parallax]',
			ratio: 5,
			offset: 0.5
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults
		this.$els = document.querySelectorAll(this.options.item)

		this.handle()
	}

	handle() {
		if (!this.$els.length) return false

		this.$els.forEach($el => {
			$el.style.willChange = 'transform'
		})

		window.addEventListener('load', () => {
			this.parallax()
		})
		window.addEventListener('scroll', () => {
			this.parallax()
		})
	}

	parallax() {
		this.$els.forEach($el => {
			let ratio = parseFloat($el.getAttribute('data-parallax-ratio')) || this.options.ratio
			let offset = parseFloat($el.getAttribute('data-parallax-offset')) || this.options.offset

			if ($el.getBoundingClientRect().y - (window.innerHeight - window.innerHeight * offset) < 0) {
				$el.style.transform = `translateY(${($el.getBoundingClientRect().y -
					(window.innerHeight - window.innerHeight * offset)) /
					ratio}px)`
			} else {
				$el.style.transform = `translateY(0px)`
			}
		})
	}
}

export default Parallax
