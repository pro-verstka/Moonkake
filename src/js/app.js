/*!
* Moonkake 7.0.0
*
* https://github.com/detectiveshelby/moonkake
*/

import './vendor/polyfills'
//import {on, off, fire} from 'delegated-events'
//import axios from 'axios'

import Utils from './components/utils'
import Tabs from './components/tabs'
import Counter from './components/count'
import Accordion from './components/accordion'
import Toggler from './components/toggler'
import Sticky from './components/sticky'
//import './components/popup'
import './components/slider'
import './components/inputmask'
import './components/map'

/* SCROLL TO
-------------------------------------------------- */

document.querySelectorAll('[data-scroll-to]').forEach($el => {
	$el.addEventListener('click', function(event) {
		event.preventDefault()

		let el = event.target

		if ($el !== el) {
			el = event.target.parentElement
		}

		let target = el.dataset.scrollTo
		let offset = el.dataset.scrollToOffset || 0

		Utils.scrollTo(target, offset)
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

const sticky = new Sticky()