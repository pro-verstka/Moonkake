const Tabs = function(options) {
	let defaults = {
		root: '.tabs',
		title: '.tabs-title',
		content: '.tabs-content',
		item: '.tabs-item',
		active: '--active'
	}

	if (typeof options === 'object') {
		Object.keys(options).forEach(key => {
			defaults[key] = options[key];
		});
	}

	this.options = defaults;

	this.handle();
};

Tabs.prototype.handle = function() {

	document.querySelectorAll(this.options.root).forEach(root => {
		let tabTitles = root.querySelectorAll(`${this.options.title} ${this.options.item}`);

		tabTitles.forEach(tabItem => {
			tabItem.addEventListener('click', () => {
				this.change(root, Array.from(tabTitles).indexOf(tabItem));
			});
		})
	});

}

Tabs.prototype.change = function(root, index) {

	let tabsTitle = root.querySelectorAll(`${this.options.title} ${this.options.item}`);
	let tabsContent = root.querySelectorAll(`${this.options.content} ${this.options.item}`);

	tabsTitle.forEach((item, key) => {
		item.classList[(key === index ? 'add' : 'remove')](this.options.active);
	});

	tabsContent.forEach((item, key) => {
		item.classList[(key === index ? 'add' : 'remove')](this.options.active);
	});

}

export default Tabs;
