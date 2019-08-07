import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

class Modal {
	constructor(options = {}) {
		let defaults = {
			modalSelector: '[data-modal]',
			modalImageSelector: '[data-modal-image]',
			modalVideoSelector: '[data-modal-video]',
			modalCloseSelector: '[data-modal-close]',

			closeByOverlayClick: true,

			modalImageId: 'modal_image',
			modalVideoId: 'modal_video'
		}

		if (typeof options === 'object') {
			this.options = Object.assign(defaults, options)
		}

		this.modals = []

		// prepare for image
		if (document.querySelector(this.options.modalImageSelector)) {
			document.body.insertAdjacentHTML(
				'beforeend',
				`
				<div class="modal modal--image" id="${this.options.modalImageId}">
					<div class="modal-container">
						<button class="modal-close" data-modal-close>&times;</button>
						<div class="modal-image"></div>
					</div>
				</div>
			`
			)
		}

		// prepare for video
		if (document.querySelector(this.options.modalVideoSelector)) {
			document.body.insertAdjacentHTML(
				'beforeend',
				`
				<div class="modal modal--video" id="${this.options.modalVideoId}">
					<div class="modal-container">
						<button class="modal-close" data-modal-close>&times;</button>
						<div class="modal-iframe"></div>
					</div>
				</div>
			`
			)
		}

		document.addEventListener('click', e => {
			// open by button
			const $elModal = e.target.matches(this.options.modalSelector) || e.target.closest(this.options.modalSelector)

			if ($elModal) {
				e.preventDefault()

				this.open($elModal.getAttribute('href').substr(1), $elModal)
			}

			// open image by link
			const $elImage =
				e.target.matches(this.options.modalImageSelector) || e.target.closest(this.options.modalImageSelector)

			if ($elImage) {
				e.preventDefault()

				this.openImage($elImage.getAttribute('href'), $elImage)
			}

			// open video by button
			const $elVideo =
				e.target.matches(this.options.modalVideoSelector) || e.target.closest(this.options.modalVideoSelector)

			if ($elVideo) {
				e.preventDefault()

				this.openVideo($elVideo.getAttribute('href'), $elVideo)
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

	emitEvent(name, detail) {
		window.dispatchEvent(
			new CustomEvent(name, {
				bubbles: true,
				detail: detail
			})
		)
	}

	setImageDimensions(image, ratio) {
		let maxWidth = 0
		let maxHeight = 0
		const padding = 40

		image.removeAttribute('style')

		if (image.width >= window.innerWidth - padding) {
			maxWidth = window.innerWidth - padding
		} else {
			maxWidth = image.width
		}

		if (image.height >= window.innerHeight - padding) {
			maxHeight = window.innerHeight - padding
		} else {
			maxHeight = image.height
		}

		image.style.maxWidth = `${maxWidth}px`
		image.style.maxHeight = `${maxHeight}px`
	}

	open(id, $trigger) {
		this.emitEvent('modalBeforeOpen', {
			id: id,
			trigger: $trigger
		})

		this.modals.push(id)

		let modal = document.getElementById(id)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		this.emitEvent('modalOpen', {
			id: id,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		this.emitEvent('modalAfterOpen', {
			id: id,
			trigger: $trigger
		})
	}

	openImage(href, $trigger) {
		this.emitEvent('modalBeforeOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		this.modals.push(this.options.modalImageId)

		const modal = document.getElementById(this.options.modalImageId)
		const modalImage = modal.querySelector('.modal-image')
		modalImage.innerHTML = 'Loading...'

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		this.emitEvent('modalOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		this.emitEvent('modalAfterOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		const image = new Image()
		image.src = href

		image.onload = () => {
			const ratio = image.width / image.height

			modalImage.classList.toggle('modal-image--portrait', image.width > image.height)
			modalImage.classList.toggle('modal-image--landscape', image.width < image.height)

			this.setImageDimensions(image, ratio)

			modalImage.innerHTML = ''
			modalImage.appendChild(image)

			window.addEventListener('resize', () => {
				this.setImageDimensions(image, ratio)
			})

			this.emitEvent('modalAfterImageLoad', {
				id: this.options.modalImageId,
				trigger: $trigger
			})
		}
	}

	openVideo(href, $trigger) {
		this.emitEvent('modalBeforeOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

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

		this.emitEvent('modalOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		this.emitEvent('modalAfterOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})
	}

	close(id) {
		this.emitEvent('modalBeforeClose', {
			id: id
		})

		let modalIndex = this.modals.indexOf(id)

		if (modalIndex > -1) {
			this.modals.splice(modalIndex, 1)
		}

		let modal = document.getElementById(id)

		modal.classList.remove('modal--visible')

		this.emitEvent('modalClose', {
			id: id
		})

		modal.addEventListener(
			'transitionend',
			e => {
				modal.classList.remove('modal--opened')

				if (modal.querySelector('.modal-iframe iframe')) {
					modal.querySelector('.modal-iframe iframe').remove()
				}

				this.emitEvent('modalAfterClose', {
					id: id
				})

				window.removeEventListener('resize', this.setImageDimensions)

				if (!this.modals.length) {
					document.documentElement.classList.remove('-modal-locked')
					clearAllBodyScrollLocks()
				}
			},
			{
				once: true
			}
		)
	}
}

export default Modal
