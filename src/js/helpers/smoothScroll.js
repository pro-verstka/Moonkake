// smoothScroll(scroll => {
// 	console.log(scroll)
// })

export default function smoothScroll(callback) {
	const ease = 0.075
	let current = 0
	let target = 0
	let rafId
	let rafActive = false

	function updateAnimation() {
		const diff = target - current
		const delta = Math.abs(diff) < 0.1 ? 0 : diff * ease

		if (delta) {
			current += delta
			current = parseFloat(current.toFixed(2))
			rafId = requestAnimationFrame(updateAnimation)
		} else {
			current = target
			rafActive = false
			cancelAnimationFrame(rafId)
		}

		callback?.(current)
	}

	function startAnimation() {
		if (!rafActive) {
			rafActive = true
			rafId = requestAnimationFrame(updateAnimation)
		}
	}

	function updateScroll() {
		target = window.scrollY || window.pageYOffset
		startAnimation()
	}

	window.addEventListener('load', startAnimation)
	window.addEventListener('scroll', updateScroll, false)
	// window.addEventListener('resize', updateScroll)
}
