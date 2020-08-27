class Sticky {
	constructor(options = {}) {
		this.options = {
			selector: '[data-sticky]',
			breakpoint: 0,
			offsetTop: 0,
			parent: '',
			disableStickySupport: false,
			calcOffsetTop: null
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		const $el =
			typeof this.options.selector == 'object' ? this.options.selector : document.querySelector(this.options.selector)
		const $elParent = this.options.parent === '' ? $el.parentElement : document.querySelector(this.options.parent)

		if (typeof calcOffsetTop !== 'function') {
			this.options.calcOffsetTop = () => this.options.offsetTop
		}

		this.options.offsetTop = this.options.calcOffsetTop()

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
		if (this.disableStickySupport) {
			return false
		}

		const $el = document.createElement('div')

		$el.style.cssText = 'position: sticky; position: -webkit-sticky; position: -ms-sticky;'

		return $el.style.position.indexOf('sticky') !== -1
	}

	handle($el, $elParent, $elFake) {
		if (window.innerWidth <= this.options.breakpoint) {
			$el.style.cssText = null

			return false
		}

		this.options.offsetTop = this.options.calcOffsetTop()

		const { top: bodyTop } = document.body.getBoundingClientRect()
		const { height: elHeight } = $el.getBoundingClientRect()
		const {
			height: elParentHeight,
			width: elParentWidth,
			top: elParentTop,
			left: elParentLeft
		} = $elParent.getBoundingClientRect()

		let position = 'static'
		let positionX = elParentLeft
		let positionY = elParentTop - bodyTop
		const width = elParentWidth
		const height = elHeight
		let display = 'none'
		let classListMethod = 'remove'

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
			classListMethod = 'add'
		}

		if (
			window.pageYOffset + window.innerHeight >=
			elParentHeight + elParentTop - bodyTop + window.innerHeight - elHeight - this.options.offsetTop
		) {
			position = 'absolute'
			positionX = 0
			positionY = elParentTop - bodyTop + elParentHeight - elHeight - (elParentTop - bodyTop)
			display = 'block'
			classListMethod = 'add'
		}

		$el.style.position = position
		$el.style.top = `${positionY}px`
		$el.style.left = `${positionX}px`
		$el.style.width = `${width}px`
		$el.clasList[classListMethod]('-sticky')

		$elFake.style.display = display
		$elFake.style.width = `${width}px`
		$elFake.style.height = `${height}px`
	}
}

export default Sticky
