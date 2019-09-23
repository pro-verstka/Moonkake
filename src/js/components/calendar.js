import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'

const calendar = flatpickr('[data-calendar]', {
	locale: Russian,
	dateFormat: 'd.n.Y',
	disableMobile: true,
	monthSelectorType: 'static'
})
