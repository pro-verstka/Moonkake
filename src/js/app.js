/*!
 * Moonkake 8.0.1
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
//import '@babel/polyfill'
import './vendor/polyfills'
//import './vendor/detect-preload'

// Libs
import { isMobile, isTouchDevice, scrollTo } from './libs/utils'
import Tabs from './libs/tabs'
import Counter from './libs/counter'
import Accordion from './libs/accordion'
import Toggler from './libs/toggler'
import Modal from './libs/modal'
import Sticky from './libs/sticky'
import Parallax from './libs/parallax'
import Fullheight from './libs/fullheight'
//import TableColumnHighlight from './libs/table-highlight'

// Components
import './components/font'
import './components/lazyload'
import './components/inputmask'
import './components/slider'
import './components/gallery'
import './components/calendar'
import './components/tooltip'
import './components/animation'
import './components/scrollbooster'
//import './components/map'

/* SETUP
-------------------------------------------------- */

if (isMobile()) {
	document.body.classList.add('-device-mobile')
}

if (isTouchDevice()) {
	document.body.classList.add('-device-touch')
}

window.MK = {
	tabs: new Tabs(),
	counter: new Counter(),
	accordion: new Accordion(),
	toggler: new Toggler(),
	modal: new Modal(),
	parallax: new Parallax(),
	fullheight: new Fullheight()
}

/* STICKY
-------------------------------------------------- */

document.querySelectorAll('[data-sticky]').forEach($el => {
	const sticky = new Sticky({
		selector: $el
	})
})

/* TABLE HIGHLIGHT
-------------------------------------------------- */

// document.querySelectorAll('[data-table-highlight]').forEach($el => {
// 	const table = new TableColumnHighlight($el)
// })

/* SCROLL TO
-------------------------------------------------- */

document.addEventListener('click', e => {
	if (e.target.matches('[data-scroll-to]')) {
		e.preventDefault()

		scrollTo(e.target.dataset.scrollTo, e.target.dataset.scrollToOffset)
	}
})
