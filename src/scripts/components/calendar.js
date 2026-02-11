import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru'

export class Calendar {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			locale: Russian,
			dateFormat: 'd.n.Y',
			disableMobile: true,
			monthSelectorType: 'static',
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
			}
		}

		this.#init()
	}

	#init() {
		this.calendar = flatpickr(this.$root, this.options)
	}
}
