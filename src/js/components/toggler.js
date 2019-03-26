// var $toggler = {
// 	options: {
// 		toggler: 'data-toggler',
// 		target: 'data-toggler-toggle',
// 		close: 'data-toggler-close',
// 		active: '-active'
// 	},

// 	init: function ($options) {
// 		var $this = this;

// 		if (typeof $options === 'object') {
// 			$this.options = $options;
// 		}

// 		$(document).on('click', '[' + $this.options.toggler + ']', function () {
// 			var _ = $(this);
// 			var target = _.attr($this.options.target);

// 			$('[' + $this.options.target + ']').each(function () {
// 				var _ = $(this);
// 				var currentTarget = _.attr($this.options.target);

// 				if (currentTarget !== target) {
// 					_.removeClass($this.options.active);
// 					$('#' + currentTarget).removeClass($this.options.active);
// 				}
// 			});

// 			_.toggleClass($this.options.active);
// 			$('body').toggleClass($this.options.active + '-' + target);

// 			$('#' + target).toggleClass($this.options.active);

// 			return false;
// 		});

// 		$(document).on('click', '[' + $this.options.close + ']', function () {
// 			var _ = $(this);
// 			var target = _.attr($this.options.close);

// 			$('[' + $this.options.target + '="'+ target +'"]').removeClass($this.options.active);
// 			$('body').removeClass($this.options.active + '-' + target);
// 			$('#' + target).removeClass($this.options.active);

// 			return false;
// 		});

// 		$(document).on('click', function () {
// 			$('[' + $this.options.toggler + ']').each(function () {
// 				var _ = $(this);
// 				var target = _.attr($this.options.target);

// 				_.removeClass($this.options.active);
// 				$('body').removeClass($this.options.active + '-' + target);
// 				$('#' + target).removeClass($this.options.active);
// 			});
// 		});

// 		$(document).on('click', '[' + $this.options.toggler + ']', function (event) {
// 			event.stopPropagation();
// 		});

// 		$('[' + $this.options.toggler + ']').each(function () {
// 			var _ = $(this);
// 			var target = _.attr($this.options.target);

// 			$('#' + target).each(function () {
// 				$(this).on('click', function (event) {
// 					if (!$(event.originalEvent.target).is('a') && !$(event.originalEvent.target).is('[' + $this.options.close + ']')) {
// 						event.stopPropagation();
// 					}
// 				});
// 			});
// 		});

// 	}
// };

// $toggler.init();

const Toggler = function (options) {

	let defaults = {
		toggler: '[data-toggler]',
		togglerClose: '[data-toggler-close]',
		activeClass: '-active'
	}

	if (typeof options === 'object') {
		// Object.keys(options).forEach(key => {
		// 	defaults[key] = options[key];
		// });
		defaults = Object.assign(defaults, options)
	}

	this.options = defaults;

	this.handle();

}

Toggler.prototype.handle = function () {

	document.querySelectorAll(this.options.toggler).forEach($el => {
		$el.addEventListener('click', event => {
			event.stopPropagation()
			event.preventDefault()

			let target = $el.dataset.toggler

			document.querySelectorAll(this.options.toggler).forEach($element => {
				let elTarget = $element.dataset.toggler

				if (elTarget !== target) {
					$element.classList.remove(this.options.activeClass)
					document.getElementById(elTarget).classList.remove(this.options.activeClass)
					document.body.classList.remove(`-${elTarget + this.options.activeClass}`)

					window.dispatchEvent(new CustomEvent('togglerClose', {
						'bubbles': true,
						'detail': $element
					}));
				}
			})

			$el.classList.toggle(this.options.activeClass)
			document.getElementById(target).classList.toggle(this.options.activeClass)
			document.body.classList.toggle(`-${target + this.options.activeClass}`)

			window.dispatchEvent(new CustomEvent('togglerChange', {
				'bubbles': true,
				'detail': $el
			}));
		})
	})

	document.querySelectorAll(this.options.togglerClose).forEach($el => {
		$el.addEventListener('click', event => {
			event.stopPropagation()
			event.preventDefault()

			let target = $el.dataset.toggler

			$el.classList.remove(this.options.activeClass)
			document.getElementById(target).classList.remove(this.options.activeClass)
			document.body.classList.remove(`-${target + this.options.activeClass}`)

			window.dispatchEvent(new CustomEvent('togglerClose', {
				'bubbles': true,
				'detail': $el
			}));
		})
	})

	document.addEventListener('click', event => {
		document.querySelectorAll(this.options.toggler).forEach($el => {
			let target = $el.dataset.toggler

			if (event.target.closest(`#${target}`) && event.target.tagName !== 'A') {
				return
			}

			if ($el.classList.contains(this.options.activeClass)) {
				$el.classList.remove(this.options.activeClass)
				document.getElementById(target).classList.remove(this.options.activeClass)
				document.body.classList.remove(`-${target + this.options.activeClass}`)

				window.dispatchEvent(new CustomEvent('togglerClose', {
					'bubbles': true,
					'detail': $el
				}));
			}
		})
	});

};

export default Toggler;