import ScrollReveal from 'scrollreveal'
// import anime from 'animejs/lib/anime.es'

window.addEventListener(MK.events.load, () => {
	ScrollReveal().reveal('[data-scroll-fx]', {
		distance: 0,
		duration: MK.animation.speed,
		interval: 100,
		opacity: 0,
		delay: 0,
		viewFactor: 0.05,
		mobile: false
		// reset: true,
		// afterReveal: $el => $el.removeAttribute('data-sr')
	})

	// const svg = anime({
	// 	targets: 'svg path',
	// 	strokeDashoffset: [anime.setDashoffset, 0],
	// 	easing: 'easeInOutSine',
	// 	duration: MK.animation.speed,
	// 	delay: function(el, i) {
	// 		return i * 250
	// 	},
	// 	direction: 'alternate',
	// 	loop: false
	// })
})
