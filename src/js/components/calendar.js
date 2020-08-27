import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru'

flatpickr('[data-calendar]', {
	locale: Russian,
	dateFormat: 'd.n.Y',
	disableMobile: true,
	monthSelectorType: 'static'
})
