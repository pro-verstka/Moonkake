/*!
 * Moonkake 8.2.0
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
import './vendor/polyfills'
//import './vendor/swiped-events'

// Libs
import { isMobile, isAndroid, isIOS, isIPad, isIPhone, isTouchDevice, scrollTo } from './libs/utils'
import Accordion from './libs/accordion'
import Counter from './libs/counter'
import Fullheight from './libs/fullheight'
import Modal from './libs/modal'
import Parallax from './libs/parallax'
import Spoiler from './libs/spoiler'
//import Sticky from './libs/sticky'
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

// React
//import './react/index'

// Vue
//import './vue/index'

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

window.MK = { ...window.MK, ...plugins }

const htmlClasses = []

if (isMobile()) htmlClasses.push('-device-mobile')
if (isTouchDevice()) htmlClasses.push('-device-touch')
if (isAndroid()) htmlClasses.push('-device-android')
if (isIOS()) htmlClasses.push('-device-ios')
if (isIPhone()) htmlClasses.push('-device-iphone')
if (isIPad()) htmlClasses.push('-device-ipad')

document.documentElement.classList.add(...htmlClasses)

/* STICKY
-------------------------------------------------- */

// document.querySelectorAll('[data-sticky]').forEach($el => {
// 	const sticky = new Sticky({
// 		selector: $el
// 	})
// })

/* TABLE HIGHLIGHT
-------------------------------------------------- */

// document.querySelectorAll('[data-table-highlight]').forEach($el => {
// 	const table = new TableColumnHighlight($el)
// })

/* SCROLL TO
-------------------------------------------------- */

document.addEventListener('click', e => {
	if (e.target.matches('[data-scroll-to]') || e.target.closest('[data-scroll-to]')) {
		e.preventDefault()

		const $el = e.target.matches('[data-scroll-to]') ? e.target : e.target.closest('[data-scroll-to]')

		scrollTo($el.getAttribute('href'), {
			offset: $el.dataset.scrollToOffset || 0
		})
	}
})
