import ScrollBooster from 'scrollbooster'

const $scrollbooster = document.querySelectorAll('[data-scrollbooster]')

if ($scrollbooster.length) {
	$scrollbooster.forEach($viewport => {
		const $content = $viewport.querySelector('[data-scrollbooster-content]')

		if ($content) {
			new ScrollBooster({
				viewport: $viewport,
				content: $content,
				mode: 'x',
				onUpdate: data => {
					$content.style.transform = `translateX(${-data.position.x}px)`
				},
				shouldScroll: () => $content.clientWidth > $viewport.clientWidth
			})
		}
	})
}
