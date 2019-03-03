const Accordion = function (options) {

	let defaults = {
		root: '.accordion',
		item: '.accordion-item',
		handler: '.accordion-header',
		active: '-active'
	}

	if (typeof options === 'object') {
		Object.keys(options).forEach(key => {
			defaults[key] = options[key];
		});
	}

	this.options = defaults;

	this.handle();

};

Accordion.prototype.handle = function() {

	document.querySelectorAll(this.options.root).forEach(el => {
		el.querySelectorAll(this.options.item).forEach(item => {
			item.querySelector(this.options.handler).addEventListener('click', () => {
				item.classList.toggle(this.options.active);
			});
		});
	});

};

export default Accordion;
