const scroll = ($target, offset = 0) => {
	if (!$target) return

	if (offset) {
		$target.style.scrollMarginTop = `${offset}px`
	}

	$target.scrollIntoView({
		behavior: 'smooth',
	})

	document.addEventListener(
		'scrollend',
		() => {
			if (offset && $target.style.scrollMarginTop) {
				$target.style.removeProperty('scroll-margin-top')
			}
		},
		{ once: true },
	)
}

/**
 * Smooth anchor scrolling with optional top offset.
 *
 * Markup:
 * <a href="#contacts" data-scroll-to data-scroll-to-offset="80">Contacts</a>
 * <section id="contacts"></section>
 *
 * @example
 * new ScrollTo()
 *
 * new ScrollTo('[data-page-scroll]')
 */
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
				const targetEl = document.querySelector($el.getAttribute('href'))

				scroll(targetEl, $el.dataset.scrollToOffset ? Number($el.dataset.scrollToOffset) : 0)
			}
		})
	}
}
