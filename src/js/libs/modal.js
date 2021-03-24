import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

const emitEvent = (name, detail) => {
	window.dispatchEvent(
		new CustomEvent(name, {
			bubbles: true,
			detail
		})
	)
}

class Modal {
	constructor(options = {}) {
		this.options = {
			modalSelector: '[data-modal]',
			modalImageSelector: '[data-modal-image]',
			modalVideoSelector: '[data-modal-video]',
			modalCloseSelector: '[data-modal-close]',

			closeByOverlayClick: true,

			modalImageId: 'modal_image',
			modalVideoId: 'modal_video',

			language: {
				loadingText: 'Loading...'
			},

			duration: 300,
			imagePadding: 40
		}

		if (typeof options === 'object') {
			this.options = { ...this.options, ...options }
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
						<div class="modal-caption"></div>
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
			if (e.target.matches(this.options.modalSelector) || e.target.closest(this.options.modalSelector)) {
				e.preventDefault()

				const $el = e.target.matches(this.options.modalSelector) ? e.target : e.target.closest(this.options.modalSelector)

				this.open($el.getAttribute('href').substr(1), $el)
			}

			// open image by link
			if (e.target.matches(this.options.modalImageSelector) || e.target.closest(this.options.modalImageSelector)) {
				e.preventDefault()

				const $el = e.target.matches(this.options.modalImageSelector)
					? e.target
					: e.target.closest(this.options.modalImageSelector)

				this.openImage($el.getAttribute('href'), $el)
			}

			// open video by button
			if (e.target.matches(this.options.modalVideoSelector) || e.target.closest(this.options.modalVideoSelector)) {
				e.preventDefault()

				const $el = e.target.matches(this.options.modalVideoSelector)
					? e.target
					: e.target.closest(this.options.modalVideoSelector)

				this.openVideo($el.getAttribute('href'), $el)
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



	setImageDimensions(image) {
		const $element = image
		let maxWidth
		let maxHeight
		const padding = this.options.imagePadding

		$element.removeAttribute('style')

		if ($element.naturalWidth >= window.innerWidth - padding) {
			maxWidth = window.innerWidth - padding
		} else {
			maxWidth = $element.naturalWidth
		}

		if ($element.naturalHeight >= window.innerHeight - padding) {
			maxHeight = window.innerHeight - padding
		} else {
			maxHeight = $element.naturalHeight
		}

		$element.style.maxWidth = `${maxWidth}px`
		$element.style.maxHeight = `${maxHeight}px`
	}

	open(id, $trigger) {
		emitEvent('modalBeforeOpen', {
			id,
			trigger: $trigger
		})

		this.modals.push(id)

		const modal = document.getElementById(id)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		emitEvent('modalOpen', {
			id,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		emitEvent('modalAfterOpen', {
			id,
			trigger: $trigger
		})
	}

	openImage(href, $trigger) {
		emitEvent('modalBeforeOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		this.modals.push(this.options.modalImageId)

		const modal = document.getElementById(this.options.modalImageId)
		const modalImage = modal.querySelector('.modal-image')
		const modalCaption = modal.querySelector('.modal-caption')
		modalImage.innerHTML = `<span class="modal-loader">${this.options.language.loadingText}</span>`

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		if (modalCaption) {
			const title = $trigger.getAttribute('title') || ''

			if (title) {
				modalCaption.innerHTML = title
				modalCaption.style.visibility = 'visible'
			}
		}

		emitEvent('modalOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		emitEvent('modalAfterOpen', {
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

			emitEvent('modalAfterImageLoad', {
				id: this.options.modalImageId,
				trigger: $trigger
			})
		}
	}

	openVideo(href, $trigger) {
		emitEvent('modalBeforeOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

		this.modals.push(this.options.modalVideoId)

		const modal = document.getElementById(this.options.modalVideoId)

		const iframe = document.createElement('iframe')
		iframe.setAttribute('allowfullscreen', 'allowfullscreen')
		iframe.setAttribute('frameborder', '0')
		iframe.setAttribute('allow', 'autoplay; fullscreen')

		if (href.indexOf('youtube') > -1) {
			const src = href.replace(/watch\?v=/g, 'embed/')

			iframe.setAttribute('src', `${src}?autoplay=1`)
		}

		if (href.indexOf('vimeo') > -1) {
			const src = href.replace(/[^0-9]/g, '')

			iframe.setAttribute('src', `https://player.vimeo.com/video/${src}?autoplay=1`)
		}

		modal.querySelector('.modal-iframe').appendChild(iframe)

		document.documentElement.classList.add('-modal-locked')

		modal.classList.add('modal--opened')

		emitEvent('modalOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

		setTimeout(() => {
			modal.classList.add('modal--visible')
		}, 10)

		disableBodyScroll(modal, {
			reserveScrollBarGap: true
		})

		emitEvent('modalAfterOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})
	}

	close(id) {
		emitEvent('modalBeforeClose', {
			id
		})

		// const modalIndex = this.modals.indexOf(id)
		//
		// if (modalIndex > -1) {
		// 	this.modals.splice(modalIndex, 1)
		// }

		this.modals = this.modals.filter(item => item !== id)

		const modal = document.getElementById(id)

		modal.classList.remove('modal--visible')

		emitEvent('modalClose', {
			id
		})

		const handleClose = () => {
			modal.classList.remove('modal--opened')

			const modalIframe = modal.querySelector('.modal-iframe iframe')
			const modalCaption = modal.querySelector('.modal-caption')

			if (modalIframe) {
				modalIframe.remove()
			}

			if (modalCaption) {
				modalCaption.style.visibility = 'hidden'
				modalCaption.innerHTML = ''
			}

			emitEvent('modalAfterClose', {
				id
			})

			window.removeEventListener('resize', this.setImageDimensions)
			modal.removeEventListener('transitionend', handleClose)

			if (!this.modals.length) {
				document.documentElement.classList.remove('-modal-locked')
				clearAllBodyScrollLocks()
			}
		}

		modal.addEventListener('transitionend', handleClose)

		// setTimeout(handleClose, this.options.duration)
	}
}

export default Modal
