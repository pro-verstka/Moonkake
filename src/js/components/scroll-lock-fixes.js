import { getScrollbarWidth } from '../helpers'

const $elements = document.querySelectorAll('[data-jump-fix]')

window.addEventListener('modalBeforeOpen', () => {
	const scrollbarWidth = getScrollbarWidth()

	$elements.forEach($el => {
		$el.style.paddingRight = `${scrollbarWidth}px`
	})

	document.body.style.paddingRight = `${scrollbarWidth}px`
	document.body.style.overflow = 'hidden'
})

window.addEventListener('modalAfterClose', () => {
	setTimeout(() => {
		$elements.forEach($el => {
			$el.style.paddingRight = ``
		})

		document.body.style.paddingRight = ''
		document.body.style.overflow = ''
	}, 10)
})
