import ScrollLock from './scroll-lock'
import { emitEvent } from '../helpers'

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

		this.scrollLock = new ScrollLock()

		this.modals = []

		// prepare for image
		if (document.querySelector(this.options.modalImageSelector)) {
			document.body.insertAdjacentHTML(
				'beforeend',
				`
				<div class="modal modal_image" id="${this.options.modalImageId}">
					<div class="modal__container">
						<button class="modal__close" data-modal-close>&times;</button>
						<div class="modal__image"></div>
						<div class="modal__caption"></div>
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
				<div class="modal modal_video" id="${this.options.modalVideoId}">
					<div class="modal__container">
						<button class="modal__close" data-modal-close>&times;</button>
						<div class="modal__iframe"></div>
					</div>
				</div>
			`
			)
		}

		document.addEventListener('click', e => {
			// open by button
			if (e.target.matches(this.options.modalSelector) || e.target.closest(this.options.modalSelector)) {
				e.preventDefault()

				const $el = e.target.matches(this.options.modalSelector)
					? e.target
					: e.target.closest(this.options.modalSelector)

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
			if (e.target.matches(this.options.modalCloseSelector) || e.target.closest(this.options.modalCloseSelector)) {
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

	open(id, $trigger = null) {
		const $modal = document.getElementById(id)

		if (!$modal) {
			console.warn(`Modal "${id}" does not exist`)
			return
		}

		emitEvent('mk:modal:beforeOpen', {
			id,
			trigger: $trigger
		})

		this.modals.push(id)

		document.documentElement.classList.add('-modal-locked')

		$modal.classList.add('modal_opened')

		emitEvent('mk:modal:open', {
			id,
			trigger: $trigger
		})

		setTimeout(() => {
			$modal.classList.add('modal_visible')
		}, 10)

		this.scrollLock.lockScroll()

		emitEvent('mk:modal:afterOpen', {
			id,
			trigger: $trigger
		})
	}

	openImage(href, $trigger = null) {
		emitEvent('mk:modal:beforeOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		this.modals.push(this.options.modalImageId)

		const $modal = document.getElementById(this.options.modalImageId)
		const $modalImage = $modal.querySelector('.modal__image')
		const $modalCaption = $modal.querySelector('.modal__caption')
		$modalImage.innerHTML = `<span class="modal__loader">${this.options.language.loadingText}</span>`

		document.documentElement.classList.add('-modal-locked')

		$modal.classList.add('modal_opened')

		if ($modalCaption) {
			const title = $trigger.getAttribute('title') || ''

			if (title) {
				$modalCaption.innerHTML = title
				$modalCaption.style.visibility = 'visible'
			}
		}

		emitEvent('mk:modal:open', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		setTimeout(() => {
			$modal.classList.add('modal_visible')
		}, 10)

		this.scrollLock.lockScroll()

		emitEvent('mk:modal:afterOpen', {
			id: this.options.modalImageId,
			trigger: $trigger
		})

		const image = new Image()
		image.src = href

		image.onload = () => {
			const ratio = image.width / image.height

			$modalImage.classList.toggle('modal__image_portrait', image.width > image.height)
			$modalImage.classList.toggle('modal__image_landscape', image.width < image.height)

			this.setImageDimensions(image, ratio)

			$modalImage.innerHTML = ''
			$modalImage.appendChild(image)

			window.addEventListener('resize', () => {
				this.setImageDimensions(image, ratio)
			})

			emitEvent('mk:modal:afterImageLoad', {
				id: this.options.modalImageId,
				trigger: $trigger
			})
		}
	}

	openVideo(href, $trigger = null) {
		emitEvent('mk:modal:beforeOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

		this.modals.push(this.options.modalVideoId)

		const $modal = document.getElementById(this.options.modalVideoId)

		const $iframe = document.createElement('iframe')
		$iframe.setAttribute('allowfullscreen', 'allowfullscreen')
		$iframe.setAttribute('frameborder', '0')
		$iframe.setAttribute('allow', 'autoplay; fullscreen')

		if (href.indexOf('youtube') > -1) {
			const src = href.replace(/watch\?v=/g, 'embed/')

			$iframe.setAttribute('src', `${src}?autoplay=1`)
		}

		if (href.indexOf('vimeo') > -1) {
			const src = href.replace(/[^0-9]/g, '')

			$iframe.setAttribute('src', `https://player.vimeo.com/video/${src}?autoplay=1`)
		}

		$modal.querySelector('.modal__iframe').appendChild($iframe)

		document.documentElement.classList.add('-modal-locked')

		$modal.classList.add('modal_opened')

		emitEvent('mk:modal:open', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})

		setTimeout(() => {
			$modal.classList.add('modal_visible')
		}, 10)

		this.scrollLock.lockScroll()

		emitEvent('mk:modal:afterOpen', {
			id: this.options.modalVideoId,
			trigger: $trigger
		})
	}

	close(id) {
		const $modal = document.getElementById(id)

		if (!$modal || this.modals.indexOf(id) < 0) {
			console.warn(`Modal "${id}" does not exist`)
			return
		}

		emitEvent('mk:modal:beforeClose', {
			id
		})

		this.modals = this.modals.filter(item => item !== id)

		$modal.classList.remove('modal_visible')

		emitEvent('mk:modal:close', {
			id
		})

		const handleClose = () => {
			$modal.classList.remove('modal_opened')

			const $modalIframe = $modal.querySelector('.modal__iframe iframe')
			const $modalCaption = $modal.querySelector('.modal__caption')

			if ($modalIframe) {
				$modalIframe.remove()
			}

			if ($modalCaption) {
				$modalCaption.style.visibility = 'hidden'
				$modalCaption.innerHTML = ''
			}

			emitEvent('mk:modal:afterClose', {
				id
			})

			window.removeEventListener('resize', this.setImageDimensions)
			$modal.removeEventListener('transitionend', handleClose)

			if (!this.modals.length) {
				document.documentElement.classList.remove('-modal-locked')
				this.scrollLock.unlockScroll()
			}
		}

		$modal.addEventListener('transitionend', handleClose)
	}
}

export default Modal
