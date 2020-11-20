import ScrollBooster from 'scrollbooster'

const $scrollBooster = document.querySelectorAll('[data-scrollbooster]')

if ($scrollBooster.length) {
	$scrollBooster.forEach($viewport => {
		const $content = $viewport.querySelector('[data-scrollbooster-content]')

		if ($content) {
			// eslint-disable-next-line no-unused-vars
			const sb = new ScrollBooster({
				viewport: $viewport,
				content: $content,
				scrollMode: 'transform',
				direction: 'horizontal',
				emulateScroll: true,
				// onUpdate: data => {
				// 	$content.style.transform = `translateX(${-data.position.x}px)`
				// },
				shouldScroll: () => $content.clientWidth > $viewport.clientWidth
			})
		}
	})
}
