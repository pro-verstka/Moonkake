const Sticky = class {

	constructor(options = {}) {
		let defaults = {
			selector: '[data-sticky]',
			breakpoint: 1024,
			offsetTop: 0,
			parent: ''
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		const $el = document.querySelector(this.options.selector)
		const $elParent = (this.options.parent == '') ? $el.parentElement : document.querySelector(this.options.parent)

		window.addEventListener('load', () => {
			this.handle($el, $elParent)
		})

		window.addEventListener('scroll', () => {
			this.handle($el, $elParent)
		})

		window.addEventListener('resize', () => {
			this.handle($el, $elParent)
		})
	}

	handle($el, $elParent) {
		if (window.innerWidth <= this.options.breakpoint) {
			$el.style = null

			return false
		}

		const { top: bodyTop } = document.body.getBoundingClientRect()
		const { height: elHeight } = $el.getBoundingClientRect()
		const { height: elParentHeight, width: elParentWidth, top: elParentTop, left: elParentLeft } = $elParent.getBoundingClientRect()

		let position = 'static'
		let positionX = elParentLeft
		let positionY = elParentTop - bodyTop
		let width = elParentWidth + elParentWidth

		if (elHeight >= elParentHeight) {
			return false
		}

		if (window.pageYOffset >= elParentTop) {
			$el.style = null
		}

		if (window.pageYOffset > elParentTop - bodyTop - this.options.offsetTop) {
			position = 'fixed'
			positionY = this.options.offsetTop
		}

		if (window.pageYOffset + window.innerHeight >= elParentHeight + elParentTop - bodyTop + window.innerHeight - elHeight - this.options.offsetTop) {
			position = 'absolute'
			positionX = 0
			positionY = (elParentTop - bodyTop) + elParentHeight - elHeight - (elParentTop - bodyTop)
		}

		$el.style.position = position
		$el.style.top = `${positionY}px`
		$el.style.left = `${positionX}px`
		$el.style.width = `${width}px`
	}
}

export default Sticky