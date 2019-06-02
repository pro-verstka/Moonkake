import scrollToElement from 'scroll-to-element'

/* UTILS
-------------------------------------------------- */

const Utils = {
	hello: function () {
		console.log('Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru')
	},

	getPageQuery: function (key) {
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
	},

	scrollTo: function ($target, offset) {
		scrollToElement($target, {
			offset: offset || 0,
			duration: 500
		})
	},

	getSection: function (selector, offset = 0) {
		let $target = null

		document.querySelectorAll(selector).forEach($el => {
			if (window.pageYOffset >= $el.offsetTop + offset) {
				$target = $el
			}
		})

		return $target
	},

	/*
	numberFormat: function (number, decimals, dec_point, thousands_sep) {
		var i, j, kw, kd, km

		if (isNaN(decimals = Math.abs(decimals))) {
			decimals = 2
		}
		if (dec_point === undefined) {
			dec_point = ','
		}
		if (thousands_sep === undefined) {
			thousands_sep = '.'
		}

		i = parseInt(number = (+number || 0).toFixed(decimals)) + ''

		if ((j = i.length) > 3) {
			j = j % 3
		} else {
			j = 0
		}

		km = j ?
			i.substr(0, j) + thousands_sep :
			''
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep)
		kd = (decimals ?
			dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, '0').slice(2) :
			'')

		return km + kw + kd
	},
	*/

	declension: function (oneNominative, severalGenitive, severalNominative, number) {
		number = number % 100;

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
			: severalGenitive;
	},

	isTouchDevice: function() {
		let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
		let mq = function(query) {
			return window.matchMedia(query).matches
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			return true
		}

		let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')

		return mq(query)
	},

	isMobile: function(agent = navigator.userAgent) {
		return /Android|iPhone|iPad|iPod/i.test(agent)
	}
}

export default Utils
