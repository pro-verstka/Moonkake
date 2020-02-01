/*!
 * Moonkake 8.1.0
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
//import '@babel/polyfill'
import './vendor/polyfills'
//import './vendor/detect-preload'
//import './vendor/swiped-events'

// Libs
import { isMobile, isAndroid, isIOS, isIPad, isIPhone, isTouchDevice, scrollTo } from './libs/utils'
import Accordion from './libs/accordion'
import Counter from './libs/counter'
import Fullheight from './libs/fullheight'
import Modal from './libs/modal'
import Parallax from './libs/parallax'
import Spoiler from './libs/spoiler'
import Sticky from './libs/sticky'
//import TableColumnHighlight from './libs/table-highlight'
import Tabs from './libs/tabs'
import Toggler from './libs/toggler'

// Components
import './components/font'
import './components/lazyload'
import './components/inputmask'
import './components/slider'
//import './components/gallery'
//import './components/calendar'
//import './components/tooltip'
import './components/animation'
//import './components/scrollbooster'
//import './components/map'

// Pages
//import './pages/index'

console.info(
	'%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru',
	'padding: 10px; background-color: #282c34; color: #fff;'
)

/* SETUP
-------------------------------------------------- */

if (typeof window.MK === 'undefined') {
	window.MK = {}
}

const plugins = {
	tabs: new Tabs(),
	counter: new Counter(),
	accordion: new Accordion(),
	toggler: new Toggler(),
	modal: new Modal(),
	parallax: new Parallax(),
	fullheight: new Fullheight(),
	spoiler: new Spoiler()
}

Object.assign(window.MK, plugins)

if (isMobile()) document.body.classList.add('-device-mobile')
if (isTouchDevice()) document.body.classList.add('-device-touch')
if (isAndroid()) document.body.classList.add('-device-android')
if (isIOS()) document.body.classList.add('-device-ios')
if (isIPhone()) document.body.classList.add('-device-iphone')
if (isIPad()) document.body.classList.add('-device-ipad')

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

		scrollTo(e.target.dataset.scrollTo, {
			offset: e.target.dataset.scrollToOffset || 0
		})
	}
})
