class TableColumnHighlight {
	constructor($table) {
		this.$root = $table

		if (!this.$root) return

		this.$root.querySelectorAll('td').forEach($el => {
			$el.addEventListener('mouseover', () => {
				this.highlightColumn($el, '#eaeaea')
			})

			$el.addEventListener('mouseout', () => {
				this.highlightColumn($el)
			})
		})

		if (this.$root.querySelector('.active')) {
			this.highlightColumnActive(this.$root.querySelector('.active'))
		}
	}

	highlightColumn($target, color = null) {
		const trs = this.$root.querySelectorAll('tr')
		const tds = $target.closest('tr').querySelectorAll('td')
		const index = Array.from(tds).indexOf($target)

		for (let i = 0; i < trs.length; i += 1) {
			const item = TableColumnHighlight.findTdSpan(trs[i], index)

			if (!item.classList.contains('active')) {
				item.style.backgroundColor = color
			}
		}
	}

	highlightColumnActive($target) {
		const trs = this.$root.querySelectorAll('tr')
		const tds = $target.closest('tr').querySelectorAll('td')
		const index = Array.from(tds).indexOf($target)

		for (let i = 0; i < trs.length; i += 1) {
			const item = TableColumnHighlight.findTdSpan(trs[i], index)
			item.classList.add('active')
		}
	}

	static findTdSpan(tr, index) {
		const tds = tr.children
		let num = 0

		for (let i = 0; i < tds.length; i += 1) {
			num += tds[i].colSpan

			if (num >= index + 1) {
				return tds[i]
			}
		}

		return true
	}
}

export default TableColumnHighlight
