import gsap from 'gsap'

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
