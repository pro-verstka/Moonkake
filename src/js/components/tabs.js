/* TABS
	-------------------------------------------------- */

// let $tabs = {
// 	options: {
// 		root: '.tabs:not(.tabs-nojs)',
// 		title: '.tabs-title',
// 		content: '.tabs-content',
// 		item: '.tabs-item',
// 		active: '-active'
// 	},

// 	changeTab: function ($root, index) {
// 		var $this = this;

// 		$root
// 			.find($this.options.title + ' ' + $this.options.item)
// 			.eq(index)
// 			.addClass($this.options.active)
// 			.siblings($this.options.item)
// 			.removeClass($this.options.active);

// 		$root
// 			.find($this.options.content + ' ' + $this.options.item)
// 			.eq(index)
// 			.addClass($this.options.active)
// 			.siblings($this.options.item)
// 			.removeClass($this.options.active);

// 		$(document).trigger('tabAfterChange', {
// 			root: $root,
// 			index: index
// 		});
// 	},

// 	init: function ($options) {
// 		var $this = this;

// 		if (typeof $options === 'object') {
// 			$this.options = $options;
// 		}

// 		$($this.options.title).on('click', $this.options.item, function () {
// 			var _ = $(this);
// 			var $root = _.closest($this.options.root);
// 			var index = _.index();

// 			$(document).trigger('tabBeforeChange', {
// 				root: $root,
// 				index: index
// 			});

// 			$this.changeTab($root, index);
// 		});
// 	}
// };

// $tabs.init();

let Tabs = function(options) {
	let defaults = {
		root: '.tabs:not(.tabs-nojs)',
		title: '.tabs-title',
		content: '.tabs-content',
		item: '.tabs-item',
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
		item.classList[(key == index ? 'add' : 'remove')](this.options.active);
	});

	tabsContent.forEach((item, key) => {
		item.classList[(key == index ? 'add' : 'remove')](this.options.active);
	});

}

export default Tabs;
