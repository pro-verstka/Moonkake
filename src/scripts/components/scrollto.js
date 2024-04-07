import { scrollTo } from '../helpers'

export class ScrollTo {
	constructor(selector = '[data-scroll-to]') {
		this.selector = selector

		this.#init()
	}

	#init() {
		this.#setupListeners()
	}

	#setupListeners() {
		document.addEventListener('click', e => {
			if (e.target.matches(this.selector) || e.target.closest(this.selector)) {
				e.preventDefault()

				const $el = e.target.matches(this.selector) ? e.target : e.target.closest(this.selector)

				scrollTo($el.getAttribute('href'), {
					offset: $el.dataset.scrollToOffset || 0,
				})
			}
		})
	}
}
