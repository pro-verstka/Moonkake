import { emitEvent } from '../helpers'

export class Toggler {
	constructor(options = {}) {
		this.options = {
			toggler: '[data-toggler]',
			togglerClose: '[data-toggler-close]',
			activeClass: '-active',
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
		}

		for (const $el of document.querySelectorAll(this.options.toggler)) {
			$el.addEventListener('click', event => {
				event.stopPropagation()
				event.preventDefault()

				const target = $el.dataset.toggler

				for (const $element of document.querySelectorAll(
					this.options.toggler,
				)) {
					const elTarget = $element.dataset.toggler

					if (elTarget !== target) {
						$element.classList.remove(this.options.activeClass)
						document
							.getElementById(elTarget)
							.classList.remove(this.options.activeClass)
						document.body.classList.remove(
							`-${elTarget + this.options.activeClass}`,
						)

						emitEvent('mk:toggler:close', {
							element: $element,
						})
					}
				}

				$el.classList.toggle(this.options.activeClass)
				document
					.getElementById(target)
					.classList.toggle(this.options.activeClass)
				document.body.classList.toggle(`-${target + this.options.activeClass}`)

				emitEvent('mk:toggler:change', {
					element: $el,
				})
			})
		}

		for (const $el of document.querySelectorAll(this.options.togglerClose)) {
			$el.addEventListener('click', event => {
				event.stopPropagation()
				event.preventDefault()

				const target = $el.dataset.toggler

				$el.classList.remove(this.options.activeClass)
				document
					.getElementById(target)
					.classList.remove(this.options.activeClass)
				document.body.classList.remove(`-${target + this.options.activeClass}`)

				emitEvent('mk:toggler:close', {
					element: $el,
				})
			})
		}

		document.addEventListener('click', event => {
			for (const $el of document.querySelectorAll(this.options.toggler)) {
				const target = $el.dataset.toggler

				if (
					event.target.closest(`#${target}`) &&
					event.target.tagName !== 'A'
				) {
					return
				}

				if ($el.classList.contains(this.options.activeClass)) {
					$el.classList.remove(this.options.activeClass)
					document
						.getElementById(target)
						.classList.remove(this.options.activeClass)
					document.body.classList.remove(
						`-${target + this.options.activeClass}`,
					)

					emitEvent('mk:toggler:close', {
						element: $el,
					})
				}
			}
		})
	}
}
