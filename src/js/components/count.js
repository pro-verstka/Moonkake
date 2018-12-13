const Counter = function (options) {

	let defaults = {
		root: '.counter',
		plus: '.counter-plus',
		minus: '.counter-minus'
	}

	if (typeof options === 'object') {
		Object.keys(options).forEach(key => {
			defaults[key] = options[key];
		});
	}

	this.options = defaults;

	this.handle();

};

Counter.prototype.handle = function() {

	document.querySelectorAll(this.options.root).forEach(el => {
		let input = el.querySelector('input');
		let min = input.dataset.min || '';
		let max = input.dataset.max || '';

		el.querySelector(this.options.plus).addEventListener('click', function () {
			let value = parseInt(input.value);

			value += 1;

			if (max && value >= max) {
				value = max;
			}

			input.value = value;
			input.dispatchEvent(new CustomEvent('change', {'bubbles': true}));
		});

		el.querySelector(this.options.minus).addEventListener('click', function () {
			let value = parseInt(input.value);

			value -= 1;

			if (min && value <= min) {
				value = min;
			} else if (value <= 1) {
				value = 1;
			}

			input.value = value;
			input.dispatchEvent(new CustomEvent('change', {'bubbles': true}));
		});

		input.addEventListener('blur', function() {
			if (this.value === '' || this.value === '0') {
				if (min) {
					this.value = min;
				} else {
					this.value = 1;
				}
			}
		});

		input.addEventListener('keyup', function() {
			let value = input.value.replace(/[^0-9]/, '');

			input.value = value;
		});

	});

};

export default Counter;
