/*!
* Moonkake 6.0.5
*
* https://github.com/detectiveshelby/moonkake
*/

//import '@babel/polyfill';
import './components/polyfills';
//import {on, off, fire} from 'delegated-events';
import axios from 'axios';

import Utils from './components/utils';
import Tabs from './components/tabs';
import Counter from './components/count';
import Accordion from './components/accordion';
import './components/toggler';
import './components/popup';
import './components/slider';
import './components/inputmask';

Utils.hello();

/* SCROLL TO
-------------------------------------------------- */

document.querySelectorAll('[data-scroll-to]').forEach($el => {
	$el.addEventListener('click', function(event) {
		event.preventDefault();

		let el = event.target;

		if ($el !== el) {
			el = event.target.parentElement;
		}

		let target = el.dataset.scrollTo;
		let offset = el.dataset.scrollToOffset || 0;

		Utils.scrollTo(target, offset);
	})
});

/* TABS
-------------------------------------------------- */

let tabs = new Tabs();

/* COUNT
-------------------------------------------------- */

let counter = new Counter();

/* ACCORDION
-------------------------------------------------- */

let accordion = new Accordion();
