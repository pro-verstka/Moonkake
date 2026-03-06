class MagneticDotsHero {
	constructor($root) {
		this.$root = $root
		this.$canvas = $root.querySelector('[data-intro-canvas]')
		this.$frame = this.$canvas?.parentElement

		if (!this.$canvas || !this.$frame) {
			return
		}

		this.context = this.$canvas.getContext('2d')

		if (!this.context) {
			return
		}

		this.dots = []
		this.pointer = { x: 0.5, y: 0.5, active: false }
		this.motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1
		this.colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
		this.time = 0
		this.frame = null
		this.resizeObserver = new ResizeObserver(() => this.setup())

		this.handlePointerMove = this.handlePointerMove.bind(this)
		this.handlePointerLeave = this.handlePointerLeave.bind(this)
		this.handleSchemeChange = this.handleSchemeChange.bind(this)
		this.animate = this.animate.bind(this)

		this.resizeObserver.observe(this.$frame)
		this.$root.addEventListener('pointermove', this.handlePointerMove)
		this.$root.addEventListener('pointerleave', this.handlePointerLeave)
		this.colorScheme.addEventListener('change', this.handleSchemeChange)
		this.setup()
	}

	setup() {
		const bounds = this.$frame.getBoundingClientRect()
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const width = Math.max(Math.round(bounds.width), 320)
		const height = Math.max(Math.round(bounds.height), 320)

		this.width = width
		this.height = height
		this.dpr = dpr

		this.$canvas.width = width * dpr
		this.$canvas.height = height * dpr
		this.$canvas.style.width = `${width}px`
		this.$canvas.style.height = `${height}px`

		this.context.setTransform(1, 0, 0, 1, 0, 0)
		this.context.scale(dpr, dpr)

		this.syncPalette()
		this.createDots()

		if (!this.frame) {
			this.frame = window.requestAnimationFrame(this.animate)
		}
	}

	handleSchemeChange() {
		this.syncPalette()
	}

	syncPalette() {
		const styles = window.getComputedStyle(this.$root)

		this.palette = {
			dot: styles.getPropertyValue('--intro-dot-color').trim() || '17 24 39',
			glowPrimary: styles.getPropertyValue('--intro-glow-primary').trim() || '59 130 246',
			glowSecondary: styles.getPropertyValue('--intro-glow-secondary').trim() || '245 158 11',
		}
	}

	createDots() {
		const spacing = this.width < 768 ? 26 : 30
		const dots = []

		for (let y = spacing; y <= this.height - spacing; y += spacing) {
			for (let x = spacing; x <= this.width - spacing; x += spacing) {
				dots.push({
					baseX: x,
					baseY: y,
					radius: Math.random() * 1.4 + 1,
					emojiSize: Math.random() * 2 + 8,
					phase: Math.random() * Math.PI * 2,
					strength: Math.random() * 0.8 + 0.6,
				})
			}
		}

		this.dots = dots
	}

	handlePointerMove(event) {
		const bounds = this.$frame.getBoundingClientRect()

		this.pointer.x = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1)
		this.pointer.y = Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1)
		this.pointer.active = true
	}

	handlePointerLeave() {
		this.pointer.active = false
	}

	animate() {
		this.time += 0.015 * (this.motion || 0.35)
		this.draw()
		this.frame = window.requestAnimationFrame(this.animate)
	}

	draw() {
		const context = this.context
		const pointerX = (this.pointer.active ? this.pointer.x : 0.5 + Math.cos(this.time * 0.7) * 0.12) * this.width
		const pointerY = (this.pointer.active ? this.pointer.y : 0.5 + Math.sin(this.time * 0.9) * 0.12) * this.height
		const radius = Math.min(this.width, this.height) * 0.22

		context.clearRect(0, 0, this.width, this.height)

		for (const dot of this.dots) {
			const offsetX = dot.baseX - pointerX
			const offsetY = dot.baseY - pointerY
			const distance = Math.hypot(offsetX, offsetY)
			const influence = Math.max(0, 1 - distance / radius)
			const angle = Math.atan2(offsetY, offsetX)
			const drift = Math.sin(this.time + dot.phase) * 3 * this.motion
			const pull = influence * 22 * dot.strength * this.motion
			const x = dot.baseX + Math.cos(angle) * pull + drift
			const y = dot.baseY + Math.sin(angle) * pull + Math.cos(this.time * 1.1 + dot.phase) * 3 * this.motion
			const alpha = 0.14 + influence * 0.5
			const size = dot.emojiSize + influence * 3

			context.save()
			context.globalAlpha = alpha
			context.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`
			context.textAlign = 'center'
			context.textBaseline = 'middle'
			context.fillText('🌚', x, y)
			context.restore()
		}

		const glow = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, radius * 1.3)
		glow.addColorStop(0, `rgb(${this.palette.glowPrimary} / 0.12)`)
		glow.addColorStop(0.55, `rgb(${this.palette.glowSecondary} / 0.08)`)
		glow.addColorStop(1, 'rgb(255 255 255 / 0)')
		context.fillStyle = glow
		context.fillRect(0, 0, this.width, this.height)
	}
}

const $introHero = document.querySelector('[data-intro-hero]')

if ($introHero) {
	new MagneticDotsHero($introHero)
}
