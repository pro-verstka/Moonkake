import 'core-js/features/array/from'
import 'core-js/features/array/find'
import 'core-js/features/array/find-index'
import 'core-js/features/array/includes'
import 'core-js/features/symbol/index'
import 'core-js/features/symbol/iterator'
import 'core-js/features/object/assign'
import 'core-js/features/object/keys'

/* Closest */
;(function(ELEMENT) {
	ELEMENT.matches =
		ELEMENT.matches ||
		ELEMENT.mozMatchesSelector ||
		ELEMENT.msMatchesSelector ||
		ELEMENT.oMatchesSelector ||
		ELEMENT.webkitMatchesSelector
	ELEMENT.closest =
		ELEMENT.closest ||
		function closest(selector) {
			if (!this) return null
			if (this.matches(selector)) return this
			if (!this.parentElement) {
				return null
			} else return this.parentElement.closest(selector)
		}
})(Element.prototype)

/* NodeList forEach */
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function(callback, thisArg) {
		thisArg = thisArg || window
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this)
		}
	}
}

/* CustomEvent */
;(function() {
	if (typeof window.CustomEvent === 'function') return false //If not IE

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined }
		var evt = document.createEvent('CustomEvent')
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
		return evt
	}

	CustomEvent.prototype = window.Event.prototype

	window.CustomEvent = CustomEvent
})()

Element.prototype.remove = function() {
	this.parentElement.removeChild(this)
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for (var i = this.length - 1; i >= 0; i--) {
		if (this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i])
		}
	}
}

// DOMTokenList interface and Element.classList / Element.relList
// Needed for: IE9-
// Use getClassList(elem) instead of elem.classList() if IE7- support is needed
// Use getRelList(elem) instead of elem.relList() if IE7- support is needed
;(function() {
	function DOMTokenListShim(o, p) {
		function split(s) {
			return s.length ? s.split(/\s+/g) : []
		}

		// NOTE: This does not exactly match the spec.
		function removeTokenFromString(token, string) {
			var tokens = split(string),
				index = tokens.indexOf(token)
			if (index !== -1) {
				tokens.splice(index, 1)
			}
			return tokens.join(' ')
		}

		Object.defineProperties(this, {
			length: {
				get: function() {
					return split(o[p]).length
				}
			},

			item: {
				value: function(idx) {
					var tokens = split(o[p])
					return 0 <= idx && idx < tokens.length ? tokens[idx] : null
				}
			},

			contains: {
				value: function(token) {
					token = String(token)
					var tokens = split(o[p])

					return tokens.indexOf(token) !== -1
				}
			},

			add: {
				value: function(/*tokens...*/) {
					var tokens = Array.prototype.slice.call(arguments).map(String)
					if (
						tokens.some(function(token) {
							return token.length === 0
						})
					) {
						throw SyntaxError()
					}
					if (
						tokens.some(function(token) {
							return /\s/.test(token)
						})
					) {
						throw Error('InvalidCharacterError')
					}

					try {
						var underlying_string = o[p]
						var token_list = split(underlying_string)
						tokens = tokens.filter(function(token) {
							return token_list.indexOf(token) === -1
						})
						if (tokens.length === 0) {
							return
						}
						if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
							underlying_string += ' '
						}
						underlying_string += tokens.join(' ')
						o[p] = underlying_string
					} finally {
						var length = split(o[p]).length
						if (this.length !== length) {
							this.length = length
						}
					}
				}
			},

			remove: {
				value: function(/*tokens...*/) {
					var tokens = Array.prototype.slice.call(arguments).map(String)
					if (
						tokens.some(function(token) {
							return token.length === 0
						})
					) {
						throw SyntaxError()
					}
					if (
						tokens.some(function(token) {
							return /\s/.test(token)
						})
					) {
						throw Error('InvalidCharacterError')
					}

					try {
						var underlying_string = o[p]
						tokens.forEach(function(token) {
							underlying_string = removeTokenFromString(token, underlying_string)
						})
						o[p] = underlying_string
					} finally {
						var length = split(o[p]).length
						if (this.length !== length) {
							this.length = length
						}
					}
				}
			},

			toggle: {
				value: function(token /*, force*/) {
					var force = arguments[1]
					try {
						token = String(token)
						if (token.length === 0) {
							throw SyntaxError()
						}
						if (/\s/.test(token)) {
							throw Error('InvalidCharacterError')
						}
						var tokens = split(o[p]),
							index = tokens.indexOf(token)

						if (index !== -1 && (!force || force === void 0)) {
							o[p] = removeTokenFromString(token, o[p])
							return false
						}
						if (index !== -1 && force) {
							return true
						}
						var underlying_string = o[p]
						if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
							underlying_string += ' '
						}
						underlying_string += token
						o[p] = underlying_string
						return true
					} finally {
						var length = split(o[p]).length
						if (this.length !== length) {
							this.length = length
						}
					}
				}
			},

			toString: {
				value: function() {
					return o[p]
				}
			}
		})
		if (!('length' in this)) {
			// In case getters are not supported
			this.length = split(o[p]).length
		} else {
			// If they are, shim in index getters (up to 100)
			for (var i = 0; i < 100; ++i) {
				Object.defineProperty(this, String(i), {
					get: (function(n) {
						return function() {
							return this.item(n)
						}
					})(i)
				})
			}
		}
	}

	// HTML - https://html.spec.whatwg.org
	// Element.classList
	if ('classList' in document.createElement('span')) {
		window.getClassList = function(elem) {
			return elem.classList
		}
	} else {
		window.getClassList = function(elem) {
			return new DOMTokenListShim(elem, 'className')
		}
		addToElementPrototype('classList', function() {
			return new DOMTokenListShim(this, 'className')
		})
	}

	// HTML - https://html.spec.whatwg.org
	// HTMLAnchorElement.relList
	// HTMLLinkElement.relList
	if ('relList' in document.createElement('link')) {
		window.getRelList = function(elem) {
			return elem.relList
		}
	} else {
		window.getRelList = function(elem) {
			return new DOMTokenListShim(elem, 'rel')
		}
		addToElementPrototype('relList', function() {
			return new DOMTokenListShim(this, 'rel')
		})
	}

	// Add second argument to native DOMTokenList.toggle() if necessary
	;(function() {
		if (!('DOMTokenList' in global)) return
		var e = document.createElement('span')
		if (!('classList' in e)) return
		e.classList.toggle('x', false)
		if (!e.classList.contains('x')) return
		global.DOMTokenList.prototype.toggle = function toggle(token /*, force*/) {
			var force = arguments[1]
			if (force === undefined) {
				var add = !this.contains(token)
				this[add ? 'add' : 'remove'](token)
				return add
			}
			force = !!force
			this[force ? 'add' : 'remove'](token)
			return force
		}
	})()
})()

// /* Object keys */
// if (!Object.keys) {
// 	Object.keys = (function() {
// 		'use strict'
// 		var hasOwnProperty = Object.prototype.hasOwnProperty,
// 			hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'),
// 			dontEnums = [
// 				'toString',
// 				'toLocaleString',
// 				'valueOf',
// 				'hasOwnProperty',
// 				'isPrototypeOf',
// 				'propertyIsEnumerable',
// 				'constructor'
// 			],
// 			dontEnumsLength = dontEnums.length

// 		return function(obj) {
// 			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
// 				throw new TypeError('Object.keys called on non-object')
// 			}

// 			var result = [],
// 				prop,
// 				i

// 			for (prop in obj) {
// 				if (hasOwnProperty.call(obj, prop)) {
// 					result.push(prop)
// 				}
// 			}

// 			if (hasDontEnumBug) {
// 				for (i = 0; i < dontEnumsLength; i++) {
// 					if (hasOwnProperty.call(obj, dontEnums[i])) {
// 						result.push(dontEnums[i])
// 					}
// 				}
// 			}
// 			return result
// 		}
// 	})()
// }

// /* Object assign */
// if (!Object.assign) {
// 	Object.defineProperty(Object, 'assign', {
// 		enumerable: false,
// 		configurable: true,
// 		writable: true,
// 		value: function(target, firstSource) {
// 			'use strict'
// 			if (target === undefined || target === null) {
// 				throw new TypeError('Cannot convert first argument to object')
// 			}

// 			var to = Object(target)
// 			for (var i = 1; i < arguments.length; i++) {
// 				var nextSource = arguments[i]
// 				if (nextSource === undefined || nextSource === null) {
// 					continue
// 				}

// 				var keysArray = Object.keys(Object(nextSource))
// 				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
// 					var nextKey = keysArray[nextIndex]
// 					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
// 					if (desc !== undefined && desc.enumerable) {
// 						to[nextKey] = nextSource[nextKey]
// 					}
// 				}
// 			}
// 			return to
// 		}
// 	})
// }

// /* Array from */
// if (!Array.from) {
// 	Array.from = (function() {
// 		var toStr = Object.prototype.toString
// 		var isCallable = function(fn) {
// 			return typeof fn === 'function' || toStr.call(fn) === '[object Function]'
// 		}
// 		var toInteger = function(value) {
// 			var number = Number(value)
// 			if (isNaN(number)) {
// 				return 0
// 			}
// 			if (number === 0 || !isFinite(number)) {
// 				return number
// 			}
// 			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number))
// 		}
// 		var maxSafeInteger = Math.pow(2, 53) - 1
// 		var toLength = function(value) {
// 			var len = toInteger(value)
// 			return Math.min(Math.max(len, 0), maxSafeInteger)
// 		}

// 		return function from(arrayLike) {
// 			var C = this

// 			var items = Object(arrayLike)

// 			if (arrayLike == null) {
// 				throw new TypeError('Array.from requires an array-like object - not null or undefined')
// 			}

// 			var mapFn = arguments.length > 1 ? arguments[1] : void undefined
// 			var T
// 			if (typeof mapFn !== 'undefined') {
// 				if (!isCallable(mapFn)) {
// 					throw new TypeError('Array.from: when provided, the second argument must be a function')
// 				}
// 				if (arguments.length > 2) {
// 					T = arguments[2]
// 				}
// 			}

// 			var len = toLength(items.length)
// 			var A = isCallable(C) ? Object(new C(len)) : new Array(len)
// 			var k = 0
// 			var kValue
// 			while (k < len) {
// 				kValue = items[k]
// 				if (mapFn) {
// 					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k)
// 				} else {
// 					A[k] = kValue
// 				}
// 				k += 1
// 			}

// 			A.length = len
// 			return A
// 		}
// 	})()
// }
