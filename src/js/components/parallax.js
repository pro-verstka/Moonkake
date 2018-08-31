/* PARALLAX
-------------------------------------------------- */

function parallax() {
	$('[data-fx-parallax-root]').each(function () {
		var $root = $(this);
		var $items = $root.find('[data-fx-parallax-item]');

		if (!$items) return;

		$items.each(function () {
			var $item = $(this);
			var data = $item.data();
			var ratio = parseFloat(data.fxParallaxRatio) || 3;
			var reverse = 'fxParallaxReverse' in data ? '-' : '';

			if ($(document).scrollTop() >= $root.offset().top && $(document).scrollTop() < $root.offset().top + $root.outerHeight()) {
				$item.css({
						'transform': 'translate3d(0, '+ reverse + ($(document).scrollTop() - $root.offset().top) / ratio + 'px, 0)'
					});
			} else {
				$item.css({
					'transform': 'translate3d(0, 0, 0)'
				});
			}
		});

	});
};

$(window).on('scroll', parallax);
$(document).on('ready', parallax);
