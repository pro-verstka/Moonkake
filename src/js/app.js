/*!
 * Moonkake 8.0.0
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
//import '@babel/polyfill'
import './vendor/polyfills'
import './vendor/detect-preload'

// Libs
import Utils from './libs/utils'
import Tabs from './libs/tabs'
import Counter from './libs/counter'
import Accordion from './libs/accordion'
import Toggler from './libs/toggler'
import Modal from './libs/modal'
import Sticky from './libs/sticky'
//import TableColumnHighlight from './libs/table-highlight'

// Components
import './components/font'
import './components/lazyload'
import './components/inputmask'
import './components/slider'
import './components/gallery'
import './components/calendar'
//import './components/tooltip'
//import './components/animation'
//import './components/map'

/* SETUP
-------------------------------------------------- */

window.MK = {}

/* MOBILE
-------------------------------------------------- */

if (Utils.isMobile()) {
	document.body.classList.add('-device-mobile')
}

if (Utils.isTouchDevice()) {
	document.body.classList.add('-device-touch')
}

/* SCROLL TO
-------------------------------------------------- */

document.querySelectorAll('[data-scroll-to]').forEach($el => {
	$el.addEventListener('click', e => {
		e.preventDefault()

		Utils.scrollTo($el.dataset.scrollTo, $el.dataset.scrollToOffset)
	})
})

/* TABS
-------------------------------------------------- */

MK.tabs = new Tabs()

/* COUNT
-------------------------------------------------- */

MK.counter = new Counter()

/* ACCORDION
-------------------------------------------------- */

MK.accordion = new Accordion()

/* TOGGLER
-------------------------------------------------- */

MK.toggler = new Toggler()

/* MODAL
-------------------------------------------------- */

MK.modal = new Modal()

/* STICKY
-------------------------------------------------- */

document.querySelectorAll('[data-sticky]').forEach($el => {
	const sticky = new Sticky({
		selector: $el
	})
})

/* TABLE HIGHLIGHT
-------------------------------------------------- */

// document.querySelectorAll('[data-highlight]').forEach($el => {
// 	const table = new TableColumnHighlight($el)
// })
