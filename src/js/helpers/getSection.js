export default function getSection(selector, offset = 0) {
	let $target = null

	document.querySelectorAll(selector).forEach($el => {
		if (window.pageYOffset >= $el.offsetTop + offset) {
			$target = $el
		}
	})

	return $target
}