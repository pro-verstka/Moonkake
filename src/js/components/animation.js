import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const initScrollAnimation = () => {
	ScrollTrigger.batch('[data-scroll-fx]:not(.-is-visible)', {
		start: 'top bottom-=10%',
		onEnter: batch => {
			batch.forEach(el => el.classList.add('-is-visible'))

			gsap.to(batch, {
				y: 0,
				opacity: 1,
				duration: 1,
				stagger: {
					each: 0.15,
					overwrite: true
				}
			})
		}
	})
}

initScrollAnimation()

MK.addMethods({ initScrollAnimation })

// import ScrollReveal from 'scrollreveal'
//
// window.addEventListener(MK.settings.event.load, () => {
// 	ScrollReveal().reveal('[data-scroll-fx]', {
// 		distance: 0,
// 		duration: MK.settings.animation.speed,
// 		interval: 100,
// 		opacity: 0,
// 		delay: 0,
// 		viewFactor: 0.05,
// 		mobile: false
// 	})
// })
