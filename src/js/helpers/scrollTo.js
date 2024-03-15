import scrollToElement from 'scroll-to-element'

export const scrollTo = ($target, options = {}, callback = () => {}) => {
	let defaults = {
		offset: 0,
		duration: 500,
	}

	if (typeof options === 'object') {
		defaults = { ...defaults, ...options }
	}

	scrollToElement($target, defaults).on('end', callback)
}
