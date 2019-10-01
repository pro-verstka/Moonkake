import Tooltip from 'tooltip.js'

const $tooltips = document.querySelectorAll('[data-tooltip]')

if ($tooltips) {
	$tooltips.forEach($el => {
		let tip = new Tooltip($el, {
			placement: $el.dataset.tooltipPosition || 'top',
			title: $el.dataset.tooltip,
			html: true
		})
	})
}
