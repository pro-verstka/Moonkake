import scrollToElement from 'scroll-to-element'

/* UTILS
-------------------------------------------------- */

export function getPageQuery(key) {
	if (!window.location.search) return false

	const query = {}

	let tmp
	let q = window.location.search
	q = q.slice(1)
	q = q.split('&')

	for (let i = 0; i < q.length; i += 1) {
		tmp = q[i].split('=')
		query[tmp[0]] = decodeURIComponent(tmp[1])
	}

	if (key) {
		return query[key]
	}

	return query
}

export function scrollTo($target, options = {}, callback) {
	let defaults = {
		offset: 0,
		duration: 500
	}

	if (typeof options === 'object') {
		defaults = { ...defaults, ...options }
	}

	scrollToElement($target, defaults).on('end', () => {
		if (typeof callback === 'function') callback()
	})
}

export function getSection(selector, offset = 0) {
	let $target = null

	document.querySelectorAll(selector).forEach($el => {
		if (window.pageYOffset >= $el.offsetTop + offset) {
			$target = $el
		}
	})

	return $target
}

export function declension(oneNominative, severalGenitive, severalNominative, number) {
	let num = number % 100

	return num <= 14 && num >= 11
		? severalGenitive
		: (num %= 10) < 5
		? num > 2
			? severalNominative
			: num === 1
			? oneNominative
			: num === 0
			? severalGenitive
			: severalNominative
		: severalGenitive
}

export function isTouchDevice() {
	/* global DocumentTouch */
	if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) return true

	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')

	return window.matchMedia(['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')).matches
}

export const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
export const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent)
export const isAndroid = () => /Android/i.test(navigator.userAgent)
export const isIPhone = () => /iPhone|iPod/i.test(navigator.userAgent)
export const isIPad = () => /iPad/i.test(navigator.userAgent)

export const getScrollbarWidth = () => window.innerWidth - document.body.clientWidth

export function setViewportHeight() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
