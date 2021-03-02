import ScrollReveal from 'scrollreveal'

/* global MK */

window.addEventListener(MK.settings.event.load, () => {
	ScrollReveal().reveal('[data-scroll-fx]', {
		distance: 0,
		duration: MK.settings.animation.speed,
		interval: 100,
		opacity: 0,
		delay: 0,
		viewFactor: 0.05,
		mobile: false
	})
})
