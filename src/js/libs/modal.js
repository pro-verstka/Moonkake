import {
	disableBodyScroll,
	clearAllBodyScrollLocks
} from 'body-scroll-lock'

class Modal {

	constructor(options = {}) {
		let defaults = {
			modalSelector: '[data-modal]',
			modalVideoSelector: '[data-modal-video]',
			modalCloseSelector: '[data-modal-close]',

			closeByOverlayClick: true,

			modalVideoId: 'modal_video'
		}

		if (typeof options === 'object') {
			defaults = Object.assign(defaults, options)
		}

		this.modals = []
		this.options = defaults

		// prepare for video
		if (document.querySelector(this.options.modalVideoSelector)) {
			document.body.insertAdjacentHTML('beforeend', `
				<div class="modal modal--video" id="${this.options.modalVideoId}">
					<div class="modal-container">
						<button class="modal-close" data-modal-close>&times;</button>
						<div class="modal-iframe"></div>
					</div>
				</div>
			`)
		}

		document.addEventListener('click', e => {
			// open by button
			if (e.target.matches(this.options.modalSelector)) {
				e.preventDefault()

				this.open(e.target.getAttribute('href').substr(1), e.target)
			}

			// open video by button
			if (e.target.matches(this.options.modalVideoSelector)) {
				e.preventDefault()

				this.openVideo(e.target.getAttribute('href'), e.target)
			}

			// close by button
			if (e.target.matches(this.options.modalCloseSelector)) {
				e.preventDefault()

				this.close(e.target.closest('.modal').getAttribute('id'))
			}

			// close by overlay click
			if (e.target.matches('.modal') && this.options.closeByOverlayClick) {
				e.preventDefault()

				this.close(e.target.getAttribute('id'))
			}
		})

		// close by Esc
		document.addEventListener('keydown', e => {
			if (document.documentElement.classList.contains('-modal-locked') && e.keyCode === 27) {
				if (this.modals.length) {
					this.close(this.modals[this.modals.length - 1])
				}
			}
		})
	}

	open(id, $trigger) {
		window.dispatchEvent(
			new CustomEvent('modalBeforeOpen', {
				bubbles: true,
				detail: {
					id: id,
					trigger: $trigger
				}
			})
		);

		this.modals.push(id)

		let modal = document.getElementById(id)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		window.dispatchEvent(
			new CustomEvent('modalOpen', {
				bubbles: true,
				detail: {
					id: id,
					trigger: $trigger
				}
			})
		);

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		window.dispatchEvent(
			new CustomEvent('modalAfterOpen', {
				bubbles: true,
				detail: {
					id: id,
					trigger: $trigger
				}
			})
		);
	}

	openVideo(href, $trigger) {
		window.dispatchEvent(
			new CustomEvent('modalBeforeOpen', {
				bubbles: true,
				detail: {
					id: this.options.modalVideoId,
					trigger: $trigger
				}
			})
		);

		this.modals.push(this.options.modalVideoId)

		let modal = document.getElementById(this.options.modalVideoId)

		let iframe = document.createElement('iframe')
		iframe.setAttribute('allowfullscreen', 'allowfullscreen')
		iframe.setAttribute('frameborder', '0')
		iframe.setAttribute('allow', 'autoplay; fullscreen')

		if (href.includes('youtube')) {
			let src = href.replace(/watch\?v=/g, 'embed/')

			iframe.setAttribute('src', `${src}?autoplay=1`)
		}

		if (href.includes('vimeo')) {
			let src = href.replace(/[^0-9]/g, '')

			iframe.setAttribute('src', `https://player.vimeo.com/video/${src}?autoplay=1`)
		}

		modal.querySelector('.modal-iframe').appendChild(iframe)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		window.dispatchEvent(
			new CustomEvent('modalOpen', {
				bubbles: true,
				detail: {
					id: this.options.modalVideoId,
					trigger: $trigger
				}
			})
		);

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		window.dispatchEvent(
			new CustomEvent('modalAfterOpen', {
				bubbles: true,
				detail: {
					id: this.options.modalVideoId,
					trigger: $trigger
				}
			})
		);
	}

	close(id) {
		window.dispatchEvent(
			new CustomEvent('modalBeforeClose', {
				bubbles: true,
				detail: {
					id: id
				}
			})
		);

		let modalIndex = this.modals.indexOf(id)

		if (modalIndex > -1) {
			this.modals.splice(modalIndex, 1)
		}

		let modal = document.getElementById(id)

		modal.classList.remove('modal--visible')

		window.dispatchEvent(
			new CustomEvent('modalClose', {
				bubbles: true,
				detail: {
					id: id
				}
			})
		);

		modal.addEventListener('transitionend', e => {
			modal.classList.remove('modal--opened')

			if (modal.querySelector('iframe')) {
				modal.querySelector('iframe').remove()
			}

			window.dispatchEvent(
				new CustomEvent('modalAfterClose', {
					bubbles: true,
					detail: {
						id: id
					}
				})
			);

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