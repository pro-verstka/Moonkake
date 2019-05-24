const Accordion = class {

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
			}
		})

		// document.querySelectorAll(`${this.options.root} ${this.options.handler}`).forEach($el => {
		// 	$el.addEventListener('click', e => {
		// 		$el.closest(this.options.item).classList.toggle(this.options.active)
		// 	})
		// })

	}

}

export default Accordion
