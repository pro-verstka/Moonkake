import scrollToElement from 'scroll-to-element'

/* UTILS
-------------------------------------------------- */

export function getPageQuery(key) {
	let query = {}

	if (window.location.search) {
		let tmp
		let q = window.location.search
		q = q.slice(1)
		q = q.split('&')

		for (let i = 0; i < q.length; i++) {
			tmp = q[i].split('=')
			query[tmp[0]] = decodeURIComponent(tmp[1])
		}

		if (key) {
			return query[key]
		} else {
			return query
		}
	}
}

export function scrollTo($target, options = {}, callback) {
	let defaults = {
		offset: 0,
		duration: 500
	}

	if (typeof options === 'object') {
		options = Object.assign(defaults, options)
	} else {
		options = defaults
	}

	scrollToElement($target, options).on('end', () => {
		if (typeof callback == 'function') callback()
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

export function numberFormat(number, decimals = 2, dec_point = ',', thousands_sep = '.') {
	var i, j, kw, kd, km

	i = parseInt((number = (+number || 0).toFixed(decimals))) + ''

	if ((j = i.length) > 3) {
		j = j % 3
	} else {
		j = 0
	}

	km = j ? i.substr(0, j) + thousands_sep : ''
	kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands_sep)
	kd = decimals
		? dec_point +
		  Math.abs(number - i)
				.toFixed(decimals)
				.replace(/-/, '0')
				.slice(2)
		: ''

	return km + kw + kd
}

export function declension(oneNominative, severalGenitive, severalNominative, number) {
	number = number % 100

	return number <= 14 && number >= 11
		? severalGenitive
		: (number %= 10) < 5
		? number > 2
			? severalNominative
			: number === 1
			? oneNominative
			: number === 0
			? severalGenitive
			: severalNominative
		: severalGenitive
}

export function isTouchDevice() {
	let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
	let mq = function(query) {
		return window.matchMedia(query).matches
	}

	if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
		return true
	}

	let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

	return mq(query)
}

export function isMobile() {
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isIOS() {
	return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isAndroid() {
	return /Android/i.test(navigator.userAgent)
}

export function isIPhone() {
	return /iPhone|iPod/i.test(navigator.userAgent)
}

export function isIPad() {
	return /iPad/i.test(navigator.userAgent)
}

export function openFullscreen($el) {
	if ($el.requestFullscreen) {
		$el.requestFullscreen()
	} else if ($el.mozRequestFullScreen) {
		$el.mozRequestFullScreen()
	} else if ($el.webkitRequestFullscreen) {
		$el.webkitRequestFullscreen()
	} else if ($el.msRequestFullscreen) {
		$el.msRequestFullscreen()
	}
}

export function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen()
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen()
	}
}
