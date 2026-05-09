import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru'

/**
 * Date picker wrapper around flatpickr.
 *
 * Markup:
 * <input data-calendar type="text" name="date">
 *
 * @example
 * document.querySelectorAll('[data-calendar]').forEach($el => {
 *   new Calendar($el, {
 *     minDate: 'today',
 *     dateFormat: 'd.m.Y',
 *   })
 * })
 */
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
