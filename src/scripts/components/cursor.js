import gsap from 'gsap'

/**
 * Custom cursor with a pointer and delayed follower.
 *
 * Markup:
 * <div data-cursor>
 *   <div data-cursor-pointer></div>
 *   <div data-cursor-follower></div>
 * </div>
 *
 * Hover targets are links and `[data-cursor-hover]` by default.
 *
 * @example
 * const $cursor = document.querySelector('[data-cursor]')
 * if ($cursor) new Cursor($cursor)
 */
export class Cursor {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			selectors: {
				cursor: '[data-cursor-pointer]',
				follower: '[data-cursor-follower]',
				hover: 'a,[data-cursor-hover]',
			},
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
			}
		}

		this.selectors = this.options.selectors

		this.$cursor = this.$root.querySelector(this.selectors.cursor)
		this.$follower = this.$root.querySelector(this.selectors.follower)

		if (!this.$cursor || !this.$follower) return

		this.#init()
	}

	#init() {
		this.#setupListeners()
	}

	#setupListeners() {
		window.addEventListener('pointermove', this.#move.bind(this))

		document.addEventListener('pointerover', e => {
			if (e.target instanceof Element && e.target.closest(this.selectors.hover)) {
				this.#over()
			}
		})

		document.addEventListener('pointerout', e => {
			if (e.target instanceof Element && e.target.closest(this.selectors.hover)) {
				this.#out()
			}
		})
	}

	#move(e) {
		gsap.to(this.$cursor, {
			x: e.clientX,
			y: e.clientY,
		})

		gsap.to(this.$follower, {
			x: e.clientX,
			y: e.clientY,
			delay: 0.1,
		})
	}

	#over() {
		gsap.to(this.$cursor, {
			scale: 0,
		})

		gsap.to(this.$follower, {
			scale: 3,
		})
	}

	#out() {
		gsap.to(this.$cursor, {
			opacity: 1,
			scale: 1,
		})
		gsap.to(this.$follower, {
			scale: 1,
		})
	}
}
