import ScrollReveal from 'scrollreveal'

window.addEventListener('load', () => {
	const fx = ScrollReveal().reveal('[data-scroll-fx]', {
		distance: '50px',
		duration: 750,
		interval: 100,
		opacity: 0,
		delay: 0,
		viewFactor: 0.5,
		mobile: false
		//reset: true
	})
})
