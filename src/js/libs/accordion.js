class Accordion {

	constructor(options = {}) {
		let defaults = {
			root: '.accordion',
			item: '.accordion-item',
			handler: '.accordion-header',
			active: '-active'
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults

		document.addEventListener('click', e => {
			if (e.target.matches(`${this.options.root} ${this.options.handler}`)) {
				e.target.closest(this.options.item).classList.toggle(this.options.active)

				window.dispatchEvent(
					new CustomEvent('accordionToggle', {
						bubbles: true,
						detail: {
							root: e.target.closest(this.options.root),
							item: e.target.closest(this.options.item)
						}
					})
				)

			}
		})

	}

}

export default Accordion
