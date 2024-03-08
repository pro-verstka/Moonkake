import { emitEvent } from '../helpers'

export class Accordion {
	constructor(options = {}) {
		this.options = {
			root: '.accordion',
			item: '.accordion__item',
			handler: '.accordion__header',
			body: '.accordion__body',
			active: 'accordion__item_active',
			animation: 'accordion_animation',
			useAnimation: false
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		if (this.options.useAnimation) {
			document.querySelectorAll(this.options.root).forEach($el => $el.classList.add(this.options.animation))
		}

		document.addEventListener('click', e => {
			if (e.target.matches(`${this.options.root} ${this.options.handler}`) || e.target.closest(this.options.handler)) {
				this.toggle(e.target)
			}
		})
	}

	toggle($el) {
		if (this.options.useAnimation) {
			const $root = $el.closest(this.options.item)
			const $body = $root.querySelector(this.options.body)
			let height = 0

			if ($root.classList.contains(this.options.active)) {
				$root.classList.remove(this.options.active)

				height = 0
			} else {
				$root.classList.add(this.options.active)

				$body.style.height = 'auto'
				height = $body.clientHeight
				$body.style.height = '0px'
			}

			setTimeout(() => {
				$body.style.height = `${height}px`
			}, 0)
		} else {
			$el.closest(this.options.item).classList.toggle(this.options.active)
		}

		emitEvent('mk:accordion:toggle', {
			root: $el.closest(this.options.root),
			item: $el.closest(this.options.item)
		})
	}
}
