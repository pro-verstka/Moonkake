import ScrollReveal from 'scrollreveal'
//import anime from 'animejs'

window.addEventListener('load', () => {
	const scrollFX = ScrollReveal().reveal('[data-scroll-fx]', {
		distance: 0,
		duration: 1500,
		interval: 100,
		opacity: 0,
		delay: 0,
		viewFactor: 0.5,
		mobile: false
		//reset: true
	})

	// const svg = anime({
	// 	targets: 'svg path',
	// 	strokeDashoffset: [anime.setDashoffset, 0],
	// 	easing: 'easeInOutSine',
	// 	duration: 1500,
	// 	delay: function(el, i) {
	// 		return i * 250
	// 	},
	// 	direction: 'alternate',
	// 	loop: false
	// })
})
