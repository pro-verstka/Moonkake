/*!
* Moonkake 7.0.1
*
* https://github.com/detectiveshelby/moonkake
*/

// Vendors
import './vendor/polyfills'
import './vendor/detect-preload'

// Libs
import Utils from './libs/utils'
import Tabs from './libs/tabs'
import Counter from './libs/counter'
import Accordion from './libs/accordion'
import Toggler from './libs/toggler'
import Sticky from './libs/sticky'
import TableColumnHighlight from './libs/table-highlight'
import Modal from './libs/modal'

// Components
//import './components/font'
import './components/lazyload'
import './components/inputmask'
import './components/slider'
import './components/gallery'
//import './components/map'

/* SCROLL TO
-------------------------------------------------- */

document.querySelectorAll('[data-scroll-to]').forEach($el => {
	$el.addEventListener('click', e => {
		e.preventDefault()

		let el = e.target

		if ($el !== el) {
			el = e.target.parentElement
		}

		Utils.scrollTo(el.dataset.scrollTo, el.dataset.scrollToOffset)
	})
})

/* TABS
-------------------------------------------------- */

const tabs = new Tabs()

/* COUNT
-------------------------------------------------- */

const counter = new Counter()

/* ACCORDION
-------------------------------------------------- */

const accordion = new Accordion()

/* TOGGLER
-------------------------------------------------- */

const toggler = new Toggler()

/* STICKY
-------------------------------------------------- */

document.querySelectorAll('[data-sticky]').forEach($el => {
	const sticky = new Sticky({
		selector: $el
	})
})

/* TABLE HIGHLIGHT
-------------------------------------------------- */

document.querySelectorAll('[data-highlight]').forEach($el => {
	const table = new TableColumnHighlight($el)
})

/* MODAL
-------------------------------------------------- */

const modal = new Modal()