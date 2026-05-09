const AXIS = {
	X: 'x',
	Y: 'y',
	BOTH: 'both',
}

const STATE = {
	IDLE: 'idle',
	DRAGGING: 'dragging',
}

const CLICK_THRESHOLD = 5
const FRAME_MS = 16.67
const FRICTION = 0.92
const MIN_VELOCITY = 0.12

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

/**
 * Mouse drag scrolling with inertia.
 *
 * Markup:
 * <div data-drag-scroll>
 *   <div data-drag-scroll-content>...</div>
 * </div>
 *
 * Options:
 * axis: 'x' | 'y' | 'both'
 *
 * On drag sets `data-drag-scroll-state="idle"|"dragging"` on the viewport.
 *
 * @example
 * // Auto initialization from app.js:
 * // document.querySelectorAll('[data-drag-scroll]').forEach($el => new DragScroll($el))
 *
 * // Horizontal only:
 * new DragScroll(document.querySelector('[data-horizontal-scroll]'), {
 *   axis: 'x',
 * })
 *
 * // Vertical only:
 * new DragScroll(document.querySelector('[data-vertical-scroll]'), {
 *   axis: 'y',
 * })
 *
 * // Both axes are enabled by default:
 * new DragScroll(document.querySelector('[data-drag-scroll]'))
 */
export class DragScroll {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$viewport = $el

		this.options = {
			axis: AXIS.BOTH,
			selectors: {
				content: '[data-drag-scroll-content]',
			},
		}

		if (options && typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
			}
		}

		if (!Object.values(AXIS).includes(this.options.axis)) {
			this.options.axis = AXIS.BOTH
		}

		this.selectors = this.options.selectors
		this.$content = this.$viewport.querySelector(this.selectors.content)

		if (!this.$content) {
			return
		}

		this.#setupState()
		this.#setupListeners()
		this.#syncState(STATE.IDLE)
	}

	#setupState() {
		this.isDragging = false
		this.hasDragged = false
		this.suppressClick = false
		this.clickResetTimer = null
		this.frame = null
		this.startPointer = { x: 0, y: 0 }
		this.lastPointer = { x: 0, y: 0 }
		this.lastMoveTime = 0
		this.velocity = { x: 0, y: 0 }

		this.handleMouseDown = this.#handleMouseDown.bind(this)
		this.handleMouseMove = this.#handleMouseMove.bind(this)
		this.handleMouseUp = this.#handleMouseUp.bind(this)
		this.handleClick = this.#handleClick.bind(this)
		this.handleWheel = this.#handleWheel.bind(this)
		this.stopInertia = this.stopInertia.bind(this)
		this.animateInertia = this.#animateInertia.bind(this)
	}

	#setupListeners() {
		this.$viewport.addEventListener('mousedown', this.handleMouseDown)
		this.$viewport.addEventListener('click', this.handleClick, true)
		this.$viewport.addEventListener('wheel', this.handleWheel, { passive: true })
		this.$viewport.addEventListener('dragstart', event => {
			if (this.isDragging) {
				event.preventDefault()
			}
		})

		window.addEventListener('resize', this.stopInertia)
		window.addEventListener('blur', this.stopInertia)
	}

	#handleMouseDown(event) {
		if (event.button !== 0 || this.#isInteractiveTarget(event.target) || !this.#canScroll()) {
			return
		}

		this.stopInertia()
		this.isDragging = true
		this.hasDragged = false
		this.startPointer = { x: event.clientX, y: event.clientY }
		this.lastPointer = { ...this.startPointer }
		this.lastMoveTime = performance.now()
		this.velocity = { x: 0, y: 0 }

		this.#syncState(STATE.DRAGGING)

		window.addEventListener('mousemove', this.handleMouseMove)
		window.addEventListener('mouseup', this.handleMouseUp, { once: true })
	}

	#handleMouseMove(event) {
		if (!this.isDragging) {
			return
		}

		const now = performance.now()
		const timeDelta = Math.max(now - this.lastMoveTime, 1)
		const pointerDelta = {
			x: event.clientX - this.lastPointer.x,
			y: event.clientY - this.lastPointer.y,
		}
		const movement = Math.hypot(event.clientX - this.startPointer.x, event.clientY - this.startPointer.y)

		if (movement > CLICK_THRESHOLD) {
			this.hasDragged = true
			event.preventDefault()
		}

		this.#scrollBy(pointerDelta, timeDelta)

		this.lastPointer = { x: event.clientX, y: event.clientY }
		this.lastMoveTime = now
	}

	#handleMouseUp() {
		if (!this.isDragging) {
			return
		}

		this.isDragging = false
		this.#syncState(STATE.IDLE)

		window.removeEventListener('mousemove', this.handleMouseMove)

		if (this.hasDragged) {
			this.suppressClick = true
			window.clearTimeout(this.clickResetTimer)
			this.clickResetTimer = window.setTimeout(() => {
				this.suppressClick = false
				this.clickResetTimer = null
			}, 0)
		}

		this.#startInertia()
	}

	#handleClick(event) {
		if (!this.suppressClick) {
			return
		}

		event.preventDefault()
		event.stopPropagation()
		this.suppressClick = false
		window.clearTimeout(this.clickResetTimer)
		this.clickResetTimer = null
	}

	#handleWheel() {
		this.stopInertia()
	}

	#scrollBy(pointerDelta, timeDelta) {
		const previous = {
			left: this.$viewport.scrollLeft,
			top: this.$viewport.scrollTop,
		}
		const next = {
			left: previous.left,
			top: previous.top,
		}

		if (this.#canScrollX()) {
			next.left = clamp(previous.left - pointerDelta.x, 0, this.#maxScrollLeft())
		}

		if (this.#canScrollY()) {
			next.top = clamp(previous.top - pointerDelta.y, 0, this.#maxScrollTop())
		}

		this.$viewport.scrollLeft = next.left
		this.$viewport.scrollTop = next.top

		this.velocity = {
			x: ((this.$viewport.scrollLeft - previous.left) / timeDelta) * FRAME_MS,
			y: ((this.$viewport.scrollTop - previous.top) / timeDelta) * FRAME_MS,
		}
	}

	#startInertia() {
		if (Math.abs(this.velocity.x) <= MIN_VELOCITY && Math.abs(this.velocity.y) <= MIN_VELOCITY) {
			return
		}

		this.frame = window.requestAnimationFrame(this.animateInertia)
	}

	#animateInertia() {
		const previous = {
			left: this.$viewport.scrollLeft,
			top: this.$viewport.scrollTop,
		}

		this.velocity.x *= FRICTION
		this.velocity.y *= FRICTION

		if (this.#canScrollX() && Math.abs(this.velocity.x) > MIN_VELOCITY) {
			this.$viewport.scrollLeft = clamp(previous.left + this.velocity.x, 0, this.#maxScrollLeft())
		} else {
			this.velocity.x = 0
		}

		if (this.#canScrollY() && Math.abs(this.velocity.y) > MIN_VELOCITY) {
			this.$viewport.scrollTop = clamp(previous.top + this.velocity.y, 0, this.#maxScrollTop())
		} else {
			this.velocity.y = 0
		}

		if (this.$viewport.scrollLeft === previous.left) {
			this.velocity.x = 0
		}

		if (this.$viewport.scrollTop === previous.top) {
			this.velocity.y = 0
		}

		if (Math.abs(this.velocity.x) <= MIN_VELOCITY && Math.abs(this.velocity.y) <= MIN_VELOCITY) {
			this.frame = null
			return
		}

		this.frame = window.requestAnimationFrame(this.animateInertia)
	}

	stopInertia() {
		if (!this.frame) {
			return
		}

		window.cancelAnimationFrame(this.frame)
		this.frame = null
		this.velocity = { x: 0, y: 0 }
	}

	#syncState(state) {
		this.$viewport.dataset.dragScrollState = state
	}

	#canScroll() {
		return this.#canScrollX() || this.#canScrollY()
	}

	#canScrollX() {
		return [AXIS.X, AXIS.BOTH].includes(this.options.axis) && this.#maxScrollLeft() > 0
	}

	#canScrollY() {
		return [AXIS.Y, AXIS.BOTH].includes(this.options.axis) && this.#maxScrollTop() > 0
	}

	#maxScrollLeft() {
		return Math.max(this.$viewport.scrollWidth - this.$viewport.clientWidth, 0)
	}

	#maxScrollTop() {
		return Math.max(this.$viewport.scrollHeight - this.$viewport.clientHeight, 0)
	}

	#isInteractiveTarget(target) {
		return target instanceof Element && target.closest('input, textarea, select, [contenteditable="true"]')
	}
}
