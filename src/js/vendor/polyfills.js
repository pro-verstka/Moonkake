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
