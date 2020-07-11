/*!
 * Moonkake 8.3.1
 *
 * https://github.com/detectiveshelby/moonkake
 */

// Vendors
import './vendor/polyfills'
//import './vendor/swiped-events'

// Config
import './config/config'

// Libs
//import Loader from './libs/loader'
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

/* SETUP
-------------------------------------------------- */

const plugins = {
	//loader: new Loader(),
	tabs: new Tabs(),
	counter: new Counter(),
	accordion: new Accordion(),
	toggler: new Toggler(),
	modal: new Modal(),
	parallax: new Parallax(),
	fullheight: new Fullheight(),
	spoiler: new Spoiler()
}

MK.plugins = { ...MK.plugins, ...plugins }

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
