import gsap from 'gsap'

export class Cursor {
	constructor() {
		this.$cursor = document.querySelector('.cursor')
		this.$follower = document.querySelector('.cursor-follower')

		if (!this.$cursor && !this.$follower) return

		this.init()
	}

	init() {
		window.addEventListener('pointermove', this.move.bind(this))

		document.addEventListener('pointerover', e => {
			if (e.target.tagName === 'A') {
				this.over()
			}
		})

		document.addEventListener('pointerout', e => {
			if (e.target.tagName === 'A') {
				this.out()
			}
		})
	}

	move(e) {
		gsap.to(this.$cursor, {
			x: e.clientX,
			y: e.clientY
		})

		gsap.to(this.$follower, {
			x: e.clientX,
			y: e.clientY,
			delay: 0.1
		})
	}

	over() {
		gsap.to(this.$cursor, {
			scale: 0
		})

		gsap.to(this.$follower, {
			scale: 3
		})
	}

	out() {
		gsap.to(this.$cursor, {
			opacity: 1,
			scale: 1
		})
		gsap.to(this.$follower, {
			scale: 1
		})
	}
}
