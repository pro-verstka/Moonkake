/*!
* Moonkake 6.0.3
*
* https://github.com/detectiveshelby/moonkake
*/

import Utils from './components/utils';
import Tabs from './components/tabs';
//import Sticky from './components/sticky';
import './components/toggler';
import './components/popup';
import './components/carousel';
import './components/inputmask';

//$(function() {

	Utils.hello();

	/* SCROLL TO
	-------------------------------------------------- */

	document.querySelectorAll('[data-scroll-to]').forEach(scrollTo => {
		scrollTo.addEventListener('click', event => {
			event.preventDefault();

			let target = event.target.dataset.scrollTo;
			let offset = event.target.dataset.scrollToOffset || 0;

			Utils.scrollTo($(target), '', offset);
		})
	});

	/* TABS
	-------------------------------------------------- */

	let tabs = new Tabs();

	/* TABLES
	-------------------------------------------------- */

	//$('article table').wrap('<div class="table"></div>');

//});
