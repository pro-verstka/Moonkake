export const isTouch = () => {
	if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) return true

	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')

	return window.matchMedia(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')).matches
}

export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
export const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)
export const isAndroid = () => /Android/i.test(navigator.userAgent)
export const isIPhone = () => /iPhone|iPod/i.test(navigator.userAgent)
export const isIPad = () => /iPad/i.test(navigator.userAgent)
