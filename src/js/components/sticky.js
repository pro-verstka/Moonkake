const Sticky = function(options) {
	let defaults = {
		el: '[data-sticky]',
		parent: '',
		offset: 0
	}

	if (typeof options === 'object') {
		Object.keys(options).forEach(key => {
			defaults[key] = options[key];
		});
	}

	this.options = defaults;

	this.handle();

	document.addEventListener('scroll', () => {
		this.handle();
	});
}

Sticky.prototype.handle = function () {

	document.querySelectorAll(this.options.el).forEach(el => {
		let parent = el.parentElement;

		if (this.options.parent !== '' && document.querySelector(this.options.parent)) {
			parent = document.querySelector(this.options.parent);
		}

		let parentOffset = parent.offsetTop - this.options.offset;
		let parentHeight = parent.offsetHeight;
		let elHeight = el.offsetHeight;

		if (window.scrollY >= parentOffset && window.scrollY <= parentOffset + parentHeight - elHeight) {

			let offsetTop = window.scrollY - parentOffset;

			el.classList.add('sticky');
			el.style.transform = `translateY(${offsetTop}px)`;

		}

		else if (window.scrollY >= parentOffset + parentHeight - elHeight && window.scrollY <= parentOffset + parentHeight + this.options.offset) {

			let offsetTop = parentOffset + parentHeight - elHeight + this.options.offset;

			el.classList.add('sticky');
			el.style.transform = `translateY(${offsetTop}px)`;

		}

		else {

			el.classList.remove('sticky');
			el.style.transform = null;

		}
	});

}

export default Sticky;
