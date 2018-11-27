/*!
* Moonkake 6.0.3
*
* https://github.com/detectiveshelby/moonkake
*/

import './components/polyfills';
import Utils from './components/utils';
import Tabs from './components/tabs';
import Counter from './components/count';
import Accordion from './components/accordion';
import './components/toggler';
import './components/popup';
import './components/carousel';
import './components/inputmask';

Utils.hello();

/* SCROLL TO
-------------------------------------------------- */

document.querySelectorAll('[data-scroll-to]').forEach(scrollTo => {
	scrollTo.addEventListener('click', event => {
		event.preventDefault();

		let el = event.target;

		if (scrollTo !== el) {
			el = event.target.parentElement;
		}

		let target = el.dataset.scrollTo;
		let offset = el.dataset.scrollToOffset || 0;

		Utils.scrollTo($(target), '', offset);
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

/* TABLES
-------------------------------------------------- */

//$('article table').wrap('<div class="table"></div>');
