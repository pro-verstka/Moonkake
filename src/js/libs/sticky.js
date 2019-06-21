class Sticky {

	constructor(options = {}) {
		let defaults = {
			selector: '[data-sticky]',
			breakpoint: 0,
			offsetTop: 0,
			parent: ''
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		const $el = (typeof this.options.selector == 'object') ? this.options.selector : document.querySelector(this.options.selector)
		const $elParent = (this.options.parent == '') ? $el.parentElement : document.querySelector(this.options.parent)

		if (this.isStickySupport()) {

			$el.style.position = 'sticky'
			$el.style.top = `${this.options.offsetTop}px`

		}

		if (!this.isStickySupport()) {

			$el.insertAdjacentHTML('afterend', '<div data-sticky-fake style="display: none;"></div>')

			const $elFake = $elParent.querySelector('[data-sticky-fake]')

			window.addEventListener('load', () => {
				this.handle($el, $elParent, $elFake)
			})

			window.addEventListener('scroll', () => {
				this.handle($el, $elParent, $elFake)
			})

			window.addEventListener('resize', () => {
				this.handle($el, $elParent, $elFake)
			})

		}
	}

	isStickySupport() {
		const $el = document.createElement('div')

		$el.style.cssText = 'position: sticky; position: -webkit-sticky; position: -ms-sticky;'

		return $el.style.position.indexOf('sticky') !== -1
	}

	handle($el, $elParent, $elFake) {
		if (window.innerWidth <= this.options.breakpoint) {
			$el.style.cssText = null

			return false
		}

		const { top: bodyTop } = document.body.getBoundingClientRect()
		const { height: elHeight } = $el.getBoundingClientRect()
		const { height: elParentHeight, width: elParentWidth, top: elParentTop, left: elParentLeft } = $elParent.getBoundingClientRect()

		let position = 'static'
		let positionX = elParentLeft
		let positionY = elParentTop - bodyTop
		let width = elParentWidth
		let height = elHeight
		let display = 'none';

		if (elHeight >= elParentHeight) {
			return false
		}

		if (window.pageYOffset >= elParentTop) {
			$el.style.cssText = null
		}

		if (window.pageYOffset > elParentTop - bodyTop - this.options.offsetTop) {
			position = 'fixed'
			positionY = this.options.offsetTop
			display = 'block'
		}

		if (window.pageYOffset + window.innerHeight >= elParentHeight + elParentTop - bodyTop + window.innerHeight - elHeight - this.options.offsetTop) {
			position = 'absolute'
			positionX = 0
			positionY = (elParentTop - bodyTop) + elParentHeight - elHeight - (elParentTop - bodyTop)
			display = 'block'
		}

		$el.style.position = position
		$el.style.top = `${positionY}px`
		$el.style.left = `${positionX}px`
		$el.style.width = `${width}px`

		$elFake.style.display = `${display}`
		$elFake.style.width = `${width}px`
		$elFake.style.height = `${height}px`
	}
}

export default Sticky