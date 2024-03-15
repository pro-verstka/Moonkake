import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru'

export class Calendar {
	constructor(selector = '[data-calendar]') {
		this.selector = selector

		this.#init()
	}

	#init() {
		this.calendar = flatpickr(this.selector, {
			locale: Russian,
			dateFormat: 'd.n.Y',
			disableMobile: true,
			monthSelectorType: 'static',
		})
	}
}
