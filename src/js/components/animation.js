import ScrollReveal from 'scrollreveal'

window.addEventListener('load', () => {
	const fx = ScrollReveal().reveal('[data-scroll-fx]', {
		distance: 0,
		duration: 1500,
		interval: 100,
		opacity: 0,
		delay: 0,
		viewFactor: 0.5,
		mobile: false
		//reset: true
	})
})
