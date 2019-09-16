import Tooltip from 'tooltip.js'

const $tooltips = document.querySelectorAll('[data-tooltip]')

if ($tooltips) {
	$tooltips.forEach($el => {
		let data = $el.dataset

		let tip = new Tooltip($el, {
			placement: data.tooltipPosition || 'top',
			title: data.tooltip,
			html: true
		})
	})
}
