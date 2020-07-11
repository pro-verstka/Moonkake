import 'core-js/features/array/from'
import 'core-js/features/array/find'
import 'core-js/features/array/find-index'
import 'core-js/features/array/includes'
import 'core-js/features/symbol/index'
import 'core-js/features/symbol/iterator'
import 'core-js/features/object/assign'
import 'core-js/features/object/keys'
import 'classlist-polyfill'
import 'element-closest-polyfill'
import 'nodelist-foreach-polyfill'
import 'custom-event-polyfill'

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
