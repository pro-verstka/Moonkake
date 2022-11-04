import ScrollBooster from 'scrollbooster'

document.querySelectorAll('[data-scrollbooster]').forEach($viewport => {
	const $content = $viewport.querySelector('[data-scrollbooster-content]')

	if (!$content) return

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
})
