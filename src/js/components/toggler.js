/* TOGGLER
-------------------------------------------------- */

var $toggler = {
	options: {
		toggler: 'data-toggler',
		target: 'data-toggler-toggle',
		close: 'data-toggler-close',
		active: '-active'
	},

	init: function ($options) {
		var $this = this;

		if (typeof $options === 'object') {
			$this.options = $options;
		}

		$(document).on('click', '[' + $this.options.toggler + ']', function () {
			var _ = $(this);
			var target = _.attr($this.options.target);

			$('[' + $this.options.target + ']').each(function () {
				var _ = $(this);
				var currentTarget = _.attr($this.options.target);

				if (currentTarget !== target) {
					_.removeClass($this.options.active);
					$('#' + currentTarget).removeClass($this.options.active);
				}
			});

			_.toggleClass($this.options.active);
			$('body').toggleClass($this.options.active + '-' + target);

			$('#' + target).toggleClass($this.options.active);

			return false;
		});

		$(document).on('click', '[' + $this.options.close + ']', function () {
			var _ = $(this);
			var target = _.attr($this.options.close);

			$('[' + $this.options.target + '="'+ target +'"]').removeClass($this.options.active);
			$('body').removeClass($this.options.active + '-' + target);
			$('#' + target).removeClass($this.options.active);

			return false;
		});

		$(document).on('click', function () {
			$('[' + $this.options.toggler + ']').each(function () {
				var _ = $(this);
				var target = _.attr($this.options.target);

				_.removeClass($this.options.active);
				$('body').removeClass($this.options.active + '-' + target);
				$('#' + target).removeClass($this.options.active);
			});
		});

		$(document).on('click', '[' + $this.options.toggler + ']', function (event) {
			event.stopPropagation();
		});

		$('[' + $this.options.toggler + ']').each(function () {
			var _ = $(this);
			var target = _.attr($this.options.target);

			$('#' + target).each(function () {
				$(this).on('click', function (event) {
					if (!$(event.originalEvent.target).is('a') && !$(event.originalEvent.target).is('[' + $this.options.close + ']')) {
						event.stopPropagation();
					}
				});
			});
		});

	}
};

$toggler.init();
