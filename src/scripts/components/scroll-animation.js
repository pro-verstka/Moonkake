import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class ScrollAnimation {
	constructor(selector = '[data-scroll-fx]:not(.-is-visible)') {
		this.selector = selector

		this.#init()
	}

	#init() {
		ScrollTrigger.batch(this.selector, {
			start: 'top bottom-=10%',
			onEnter: batch => {
				for (const $el of batch) {
					$el.classList.add('-is-visible')
				}

				gsap.to(batch, {
					y: 0,
					opacity: 1,
					duration: 1,
					stagger: {
						each: 0.15,
						overwrite: true,
					},
				})
			},
		})
	}
}
