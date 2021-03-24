/*!
 * Moonkake 8.4.2
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
import './vendor/polyfills'

// Config
import './config/config'

// Libs
import Accordion from './libs/accordion'
// import Counter from './libs/counter'
// import FullHeight from './libs/fullheight'
import Modal from './libs/modal'
// import Parallax from './libs/parallax'
// import Spoiler from './libs/spoiler'
// import Sticky from './libs/sticky'
// import TableColumnHighlight from './libs/table-highlight'
import Tabs from './libs/tabs'
import Toggler from './libs/toggler'
import Field from './libs/field'
// import Select from './libs/select'

// Components
import './components/font'
import './components/lazyload'
import './components/inputmask'
import './components/slider'
// import './components/gallery'
// import './components/calendar'
// import './components/tooltip'
import './components/animation'
// import './components/scrollbooster'
// import './components/map'
import './components/scrollto'

// Pages
// import './pages/index'

// React
// import './react/index'

// Vue
// import './vue/index'

/* SETUP
-------------------------------------------------- */

MK.addPlugins({ Tabs, Accordion, Toggler, Modal, Field })

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

/* FOOLPROOF
-------------------------------------------------- */

// let currentDevice = isMobile()
// let previousDevice = currentDevice
//
// window.addEventListener('resize', () => {
// 	currentDevice = isMobile()
//
// 	if (currentDevice !== previousDevice) window.location.reload(true)
//
// 	previousDevice = isMobile()
// })
