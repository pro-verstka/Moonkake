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

		this.handle()
	}

	handle() {
		document.querySelectorAll(this.options.root).forEach($el => {
			$el.querySelectorAll(this.options.item).forEach($item => {
				$item.querySelector(this.options.handler).addEventListener('click', () => {
					$item.classList.toggle(this.options.active)
				})
			})
		})
	}

}

export default Accordion
