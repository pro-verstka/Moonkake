import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const Modal = class {

	constructor(options = {}) {
		let defaults = {
			modalSelector: '[data-modal]',
			closeSelector: '[data-modal-close]',
			//type: 'inline', // inline, media
			closeByOverlayClick: true
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.options = defaults
		this.modals = []

		// open by button
		document.querySelectorAll(this.options.modalSelector).forEach($el => {
			$el.addEventListener('click', e => {
				e.preventDefault()

				this.open($el.dataset.modal)
			})
		})

		// close by button
		document.querySelectorAll(this.options.closeSelector).forEach($el => {
			$el.addEventListener('click', e => {
				e.preventDefault()

				this.close($el.dataset.modalClose)
			})
		})

		// close by overlay click
		document.querySelectorAll('.modal').forEach($el => {
			$el.addEventListener('click', e => {
				if (!this.options.closeByOverlayClick) {
					return false
				}

				if (e.target.matches('.modal')) {
					this.close($el.getAttribute('id'))
				}
			})
		})

		// close by Esc
		document.body.addEventListener('keydown', e => {
			if (document.documentElement.classList.contains('-modal-locked') && e.keyCode === 27) {
				if (this.modals.length) {
					this.close(this.modals[this.modals.length - 1])
				}
			}
		})
	}

	open(id) {
		this.modals.push(id)

		const modal = document.getElementById(id)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		// if (this.modals.length > 1) {
		// 	modal.classList.add('modal--exists')
		// }

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})
	}

	close(id) {
		const modalIndex = this.modals.indexOf(id)

		if (modalIndex > -1) {
			this.modals.splice(modalIndex, 1)
		}

		const modal = document.getElementById(id)

		modal.classList.remove('modal--visible')

		modal.addEventListener('transitionend', e => {
			modal.classList.remove('modal--opened')
			//modal.classList.remove('modal--exists')

			if (!this.modals.length) {
				document.documentElement.classList.remove('-modal-locked')
				clearAllBodyScrollLocks()
			}
		}, {
			once: true
		})
	}
}

export default Modal