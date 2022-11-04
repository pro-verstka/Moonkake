const isTouch = () => {
	/* global DocumentTouch */
	if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) return true

	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')

	return window.matchMedia(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')).matches
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)
const isAndroid = () => /Android/i.test(navigator.userAgent)
const isIPhone = () => /iPhone|iPod/i.test(navigator.userAgent)
const isIPad = () => /iPad/i.test(navigator.userAgent)

export { isTouch, isMobile, isIOS, isAndroid, isIPhone, isIPad }
