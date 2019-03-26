import scrollToElement from 'scroll-to-element';

/* UTILS
-------------------------------------------------- */

let Utils = {
	hello: function () {
		console.log('Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru');
	},

	getPageQuery: function (key) {
		let query = {};

		if (window.location.search) {
			let tmp;
			let q = window.location.search;
			q = q.slice(1);
			q = q.split('&');

			for (let i = 0; i < q.length; i++) {
				tmp = q[i].split('=');
				query[tmp[0]] = decodeURIComponent(tmp[1]);
			}

			if (key) {
				return query[key];
			} else {
				return query;
			}
		}
	},

	scrollTo: function ($target, offset = 0) {
		scrollToElement($target, {
			offset: offset,
			duration: 500
		});
	},

	getSection: function (target, offset = 0) {
		let $item = null;

		document.querySelectorAll(target).forEach($el => {
			if (window.pageYOffset >= $el.offsetTop + offset) {
				$item = $el;
			}
		})

		return $item;
	},

	/*
	numberFormat: function (number, decimals, dec_point, thousands_sep) {
		var i, j, kw, kd, km;

		if (isNaN(decimals = Math.abs(decimals))) {
			decimals = 2;
		}
		if (dec_point === undefined) {
			dec_point = ',';
		}
		if (thousands_sep === undefined) {
			thousands_sep = '.';
		}

		i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

		if ((j = i.length) > 3) {
			j = j % 3;
		} else {
			j = 0;
		}

		km = j ?
			i.substr(0, j) + thousands_sep :
			'';
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
		kd = (decimals ?
			dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, '0').slice(2) :
			'');

		return km + kw + kd;
	},
	*/

	isTouchDevice: function() {
		let prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
		let mq = function(query) {
			return window.matchMedia(query).matches;
		}

		if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
			return true;
		}

		let query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');

		return mq(query);
	}
};

export default Utils;
