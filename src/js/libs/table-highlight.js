class TableColumnHighlight {
	constructor($table) {
		this.$root = $table

		this.$root.querySelectorAll('td').forEach($el => {
			$el.addEventListener('mouseover', event => {
				this.highlightColumn($el, '#eaeaea')
			})

			$el.addEventListener('mouseout', event => {
				this.highlightColumn($el)
			})
		})

		if (this.$root.querySelector('.active')) {
			this.highlightColumnActive(this.$root.querySelector('.active'))
		}
	}

	highlightColumn($target, color = null) {
		let trs = this.$root.querySelectorAll('tr')
		let tds = $target.closest('tr').querySelectorAll('td')
		let index = Array.from(tds).indexOf($target)

		for (let i = 0; i < trs.length; i++) {
			let item = this.findTdSpan(trs[i], index)

			if (!item.classList.contains('active')) {
				item.style.backgroundColor = color
			}
		}
	}

	highlightColumnActive($target) {
		let trs = this.$root.querySelectorAll('tr')
		let tds = $target.closest('tr').querySelectorAll('td')
		let index = Array.from(tds).indexOf($target)

		for (let i = 0; i < trs.length; i++) {
			let item = this.findTdSpan(trs[i], index)
			item.classList.add('active')
		}
	}

	findTdSpan(tr, index) {
		let tds = tr.children
		let num = 0

		for (let i = 0; i < tds.length; i++) {
			num += tds[i].colSpan

			if (num >= index + 1) {
				return tds[i]
			}
		}
	}
}

export default TableColumnHighlight
