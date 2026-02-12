import { emitEvent } from '$helpers'
import { ScrollLock } from '$utils'

const STATE = {
	OPENING: 'opening',
	OPENED: 'opened',
	CLOSING: 'closing',
	CLOSED: 'closed',
}

const LOCK_STATE = {
	LOCKED: 'locked',
	UNLOCKED: 'unlocked',
}

const TYPE = {
	DEFAULT: 'default',
	IMAGE: 'image',
	VIDEO: 'video',
}

const EVENT = {
	BEFORE_OPEN: 'mk:modal:beforeOpen',
	OPEN: 'mk:modal:open',
	AFTER_OPEN: 'mk:modal:afterOpen',
	BEFORE_CLOSE: 'mk:modal:beforeClose',
	CLOSE: 'mk:modal:close',
	AFTER_CLOSE: 'mk:modal:afterClose',
	AFTER_IMAGE_LOAD: 'mk:modal:afterImageLoad',
}

const KEY = {
	ESCAPE: 'Escape',
}

const IFRAME_DEFAULT_PARAMS = {
	allowfullscreen: 'allowfullscreen',
	frameborder: '0',
	allow: 'autoplay; fullscreen',
}

export const youtubeVideoPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
	if (url.hostname.includes('youtube.com')) {
		if (url.pathname.includes('/embed/')) {
			return {
				...iframeDefaults,
				src: `https://www.youtube.com${url.pathname}?autoplay=1`,
			}
		}

		const id = url.searchParams.get('v')

		if (id) {
			return {
				...iframeDefaults,
				src: `https://www.youtube.com/embed/${id}?autoplay=1`,
			}
		}
	}

	if (url.hostname.includes('youtu.be')) {
		const id = url.pathname.replace('/', '')

		if (id) {
			return {
				...iframeDefaults,
				src: `https://www.youtube.com/embed/${id}?autoplay=1`,
			}
		}
	}

	return null
}

export const vimeoVideoPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
	if (!url.hostname.includes('vimeo.com')) {
		return null
	}

	const id = url.pathname.replace(/[^0-9]/g, '')

	if (!id) {
		return null
	}

	return {
		...iframeDefaults,
		src: `https://player.vimeo.com/video/${id}?autoplay=1`,
	}
}

export const rutubeVideoPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
	if (!url.hostname.includes('rutube.ru')) {
		return null
	}

	const pathParts = url.pathname.split('/').filter(Boolean)
	let id = ''

	if (pathParts[0] === 'video' && pathParts[1]) {
		id = pathParts[1]
	}

	if (pathParts[0] === 'play' && pathParts[1] === 'embed' && pathParts[2]) {
		id = pathParts[2]
	}

	if (!id) {
		return null
	}

	const embedParamNames = new Set(['t', 'stopTime', 'skinColor', 'getPlayOptions', 'p'])
	const embedSearchParams = new URLSearchParams()

	for (const [name, value] of url.searchParams.entries()) {
		if (embedParamNames.has(name)) {
			embedSearchParams.append(name, value)
		}
	}

	const query = embedSearchParams.toString()
	const src = `https://rutube.ru/play/embed/${id}${query ? `?${query}` : ''}`

	return {
		...iframeDefaults,
		src,
	}
}

export class Modal {
	constructor(options = {}) {
		this.options = {
			selectors: {
				root: '.modal[data-modal]',
				trigger: '[data-modal][href]',
				triggerImage: '[data-modal-image]',
				triggerVideo: '[data-modal-video]',
				close: '[data-modal-close]',
				iframe: '[data-modal-iframe]',
				image: '[data-modal-image-content]',
				caption: '[data-modal-caption]',
			},
			ids: {
				image: 'modal_image',
				video: 'modal_video',
			},
			closeByOverlayClick: true,
			language: {
				loadingText: 'Loading...',
			},
			duration: 300,
			imagePadding: 40,
			videoPlugins: [],
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
				ids: {
					...this.options.ids,
					...(options.ids || {}),
				},
				language: {
					...this.options.language,
					...(options.language || {}),
				},
			}
		}

		this.selectors = this.options.selectors
		this.ids = this.options.ids
		this.videoPlugins = Array.isArray(this.options.videoPlugins) ? this.options.videoPlugins : []

		this.scrollLock = new ScrollLock()
		this.modals = []
		this.imageResizeHandlers = new Map()
		this.focusReturnTargets = new Map()

		this.#init()
	}

	#init() {
		this.#prepareMediaModals()
		this.#setupInitialState()
		this.#setupListeners()
	}

	#setupInitialState() {
		for (const $modal of document.querySelectorAll(this.selectors.root)) {
			const { state } = $modal.dataset
			const isValidState = Object.values(STATE).includes(state)

			if (!isValidState) {
				$modal.dataset.state = STATE.CLOSED
			}

			if (!$modal.dataset.modalType) {
				$modal.dataset.modalType = TYPE.DEFAULT
			}

			if (!$modal.getAttribute('role')) {
				$modal.setAttribute('role', 'dialog')
			}

			if (!$modal.hasAttribute('aria-modal')) {
				$modal.setAttribute('aria-modal', 'true')
			}

			$modal.setAttribute(
				'aria-hidden',
				$modal.dataset.state === STATE.OPENED || $modal.dataset.state === STATE.OPENING ? 'false' : 'true',
			)

			if (!$modal.hasAttribute('tabindex')) {
				$modal.setAttribute('tabindex', '-1')
			}
		}

		document.documentElement.dataset.modalState = LOCK_STATE.UNLOCKED
	}

	#setupListeners() {
		document.addEventListener('click', this.#onDocumentClick.bind(this))
		document.addEventListener('keydown', this.#onDocumentKeydown.bind(this))
	}

	#onDocumentClick(event) {
		if (!(event.target instanceof Element)) {
			return
		}

		const $trigger = event.target.closest(this.selectors.trigger)

		if ($trigger) {
			event.preventDefault()
			const id = this.#extractIdFromTrigger($trigger)

			if (id) {
				this.open(id, $trigger)
			}

			return
		}

		const $imageTrigger = event.target.closest(this.selectors.triggerImage)

		if ($imageTrigger) {
			event.preventDefault()
			const href = $imageTrigger.getAttribute('href')

			if (href) {
				this.openImage(href, $imageTrigger)
			}

			return
		}

		const $videoTrigger = event.target.closest(this.selectors.triggerVideo)

		if ($videoTrigger) {
			event.preventDefault()
			const href = $videoTrigger.getAttribute('href')

			if (href) {
				this.openVideo(href, $videoTrigger)
			}

			return
		}

		const $close = event.target.closest(this.selectors.close)

		if ($close) {
			event.preventDefault()
			const $modal = $close.closest(this.selectors.root)

			if ($modal?.id) {
				this.close($modal.id)
			}

			return
		}

		if (event.target.matches(this.selectors.root) && this.options.closeByOverlayClick) {
			event.preventDefault()

			if (event.target.id) {
				this.close(event.target.id)
			}
		}
	}

	#onDocumentKeydown(event) {
		if (event.key !== KEY.ESCAPE) {
			return
		}

		if (!this.modals.length) {
			return
		}

		this.close(this.modals[this.modals.length - 1])
	}

	#prepareMediaModals() {
		if (document.querySelector(this.selectors.triggerImage) && !this.#getModalById(this.ids.image)) {
			document.body.insertAdjacentHTML(
				'beforeend',
				`
				<div
					class="modal"
					id="${this.ids.image}"
					data-modal
					data-modal-type="${TYPE.IMAGE}"
					data-state="${STATE.CLOSED}"
					role="dialog"
					aria-modal="true"
					aria-hidden="true"
					tabindex="-1"
				>
					<div class="modal__container" data-modal-container>
						<button class="modal__close" data-modal-close>&times;</button>
						<div class="modal__image" data-modal-image-content></div>
						<div class="modal__caption" data-modal-caption></div>
					</div>
				</div>
			`,
			)
		}

		if (document.querySelector(this.selectors.triggerVideo) && !this.#getModalById(this.ids.video)) {
			document.body.insertAdjacentHTML(
				'beforeend',
				`
				<div
					class="modal"
					id="${this.ids.video}"
					data-modal
					data-modal-type="${TYPE.VIDEO}"
					data-state="${STATE.CLOSED}"
					role="dialog"
					aria-modal="true"
					aria-hidden="true"
					tabindex="-1"
				>
					<div class="modal__container" data-modal-container>
						<button class="modal__close" data-modal-close>&times;</button>
						<div class="modal__iframe" data-modal-iframe></div>
					</div>
				</div>
			`,
			)
		}
	}

	#extractIdFromTrigger($trigger) {
		const href = $trigger.getAttribute('href') || ''

		if (!href.startsWith('#')) {
			return null
		}

		return href.slice(1)
	}

	#normalizeId(id) {
		return String(id || '').replace(/^#/, '')
	}

	#getModalById(id) {
		const normalizedId = this.#normalizeId(id)
		const $modal = document.getElementById(normalizedId)

		if (!$modal || !$modal.matches(this.selectors.root)) {
			return null
		}

		return $modal
	}

	#isOpened(id) {
		return this.modals.includes(id)
	}

	#setModalState($modal, state) {
		$modal.dataset.state = state
		$modal.setAttribute('aria-hidden', state === STATE.OPENED || state === STATE.OPENING ? 'false' : 'true')
	}

	#saveFocusTarget(id, $trigger) {
		const focusTarget =
			$trigger instanceof HTMLElement
				? $trigger
				: document.activeElement instanceof HTMLElement
					? document.activeElement
					: null

		if (focusTarget) {
			this.focusReturnTargets.set(id, focusTarget)
		}
	}

	#focusModal($modal) {
		$modal.focus()
	}

	#restoreFocus(id) {
		const $target = this.focusReturnTargets.get(id)

		if (!$target) {
			return
		}

		this.focusReturnTargets.delete(id)

		if (document.contains($target)) {
			$target.focus()
		}
	}

	#lock() {
		document.documentElement.dataset.modalState = LOCK_STATE.LOCKED
		this.scrollLock.lockScroll()
	}

	#unlock() {
		document.documentElement.dataset.modalState = LOCK_STATE.UNLOCKED
		this.scrollLock.unlockScroll()
	}

	#emit(eventName, detail = {}) {
		emitEvent(eventName, detail)
	}

	#waitForTransition($modal, callback) {
		let completed = false

		const finish = () => {
			if (completed) {
				return
			}

			completed = true
			$modal.removeEventListener('transitionend', onTransitionEnd)
			clearTimeout(timer)
			callback()
		}

		const onTransitionEnd = event => {
			if (event.target !== $modal) {
				return
			}

			finish()
		}

		const timer = setTimeout(finish, this.options.duration + 100)
		$modal.addEventListener('transitionend', onTransitionEnd)
	}

	#resolveVideoIframeParams(url) {
		for (const plugin of this.videoPlugins) {
			if (typeof plugin !== 'function') {
				continue
			}

			try {
				const result = plugin(url, IFRAME_DEFAULT_PARAMS)

				if (result && typeof result === 'object' && typeof result.src === 'string' && result.src) {
					return result
				}
			} catch {}
		}

		return null
	}

	#applyIframeParams($iframe, params = {}) {
		for (const [key, value] of Object.entries(params)) {
			if (value === null || value === undefined || value === false) {
				continue
			}

			if (value === true) {
				$iframe.setAttribute(key, '')
				continue
			}

			$iframe.setAttribute(key, String(value))
		}
	}

	#createVideoIframe(href) {
		try {
			const url = new URL(href, window.location.origin)
			const iframeParams = this.#resolveVideoIframeParams(url)

			if (!iframeParams) {
				return null
			}

			const $iframe = document.createElement('iframe')
			this.#applyIframeParams($iframe, {
				...IFRAME_DEFAULT_PARAMS,
				...iframeParams,
			})

			return $iframe
		} catch {
			return null
		}
	}

	#setImageDimensions(image) {
		let maxWidth
		let maxHeight
		const padding = this.options.imagePadding

		image.removeAttribute('style')

		if (image.naturalWidth >= window.innerWidth - padding) {
			maxWidth = window.innerWidth - padding
		} else {
			maxWidth = image.naturalWidth
		}

		if (image.naturalHeight >= window.innerHeight - padding) {
			maxHeight = window.innerHeight - padding
		} else {
			maxHeight = image.naturalHeight
		}

		image.style.maxWidth = `${maxWidth}px`
		image.style.maxHeight = `${maxHeight}px`
	}

	#cleanupModal($modal) {
		const id = $modal.id
		const $iframeWrap = $modal.querySelector(this.selectors.iframe)
		const $caption = $modal.querySelector(this.selectors.caption)
		const $image = $modal.querySelector(this.selectors.image)

		if ($iframeWrap) {
			$iframeWrap.innerHTML = ''
		}

		if ($caption) {
			$caption.style.visibility = 'hidden'
			$caption.innerHTML = ''
		}

		if ($image) {
			delete $image.dataset.orientation
		}

		const resizeHandler = this.imageResizeHandlers.get(id)

		if (resizeHandler) {
			window.removeEventListener('resize', resizeHandler)
			this.imageResizeHandlers.delete(id)
		}
	}

	open(id, $trigger = null) {
		const normalizedId = this.#normalizeId(id)
		const $modal = this.#getModalById(normalizedId)

		if (!$modal) {
			console.warn(`Modal "${normalizedId}" does not exist`)
			return
		}

		if (this.#isOpened(normalizedId)) {
			return
		}

		this.#emit(EVENT.BEFORE_OPEN, {
			id: normalizedId,
			trigger: $trigger,
		})

		this.#saveFocusTarget(normalizedId, $trigger)

		const shouldLock = this.modals.length === 0
		this.modals.push(normalizedId)

		if (shouldLock) {
			this.#lock()
		}

		this.#setModalState($modal, STATE.OPENING)

		this.#emit(EVENT.OPEN, {
			id: normalizedId,
			trigger: $trigger,
		})

		requestAnimationFrame(() => {
			this.#setModalState($modal, STATE.OPENED)
			this.#focusModal($modal)
		})

		this.#emit(EVENT.AFTER_OPEN, {
			id: normalizedId,
			trigger: $trigger,
		})
	}

	openImage(href, $trigger = null) {
		const $modal = this.#getModalById(this.ids.image)

		if (!$modal) {
			console.warn(`Modal "${this.ids.image}" does not exist`)
			return
		}

		const $modalImage = $modal.querySelector(this.selectors.image)
		const $modalCaption = $modal.querySelector(this.selectors.caption)

		if ($modalImage) {
			$modalImage.innerHTML = `<span class="modal__loader">${this.options.language.loadingText}</span>`
		}

		if ($modalCaption) {
			const title = $trigger?.getAttribute('title') || ''
			$modalCaption.innerHTML = title
			$modalCaption.style.visibility = title ? 'visible' : 'hidden'
		}

		this.open(this.ids.image, $trigger)

		const image = new Image()
		image.src = href

		image.onload = () => {
			if (!$modalImage) {
				return
			}

			const orientation = image.width > image.height ? 'landscape' : image.width < image.height ? 'portrait' : 'square'

			$modalImage.dataset.orientation = orientation
			this.#setImageDimensions(image)

			$modalImage.innerHTML = ''
			$modalImage.appendChild(image)

			const resizeHandler = () => {
				this.#setImageDimensions(image)
			}

			const prevResizeHandler = this.imageResizeHandlers.get(this.ids.image)

			if (prevResizeHandler) {
				window.removeEventListener('resize', prevResizeHandler)
			}

			window.addEventListener('resize', resizeHandler)
			this.imageResizeHandlers.set(this.ids.image, resizeHandler)

			this.#emit(EVENT.AFTER_IMAGE_LOAD, {
				id: this.ids.image,
				trigger: $trigger,
			})
		}
	}

	openVideo(href, $trigger = null) {
		const $modal = this.#getModalById(this.ids.video)

		if (!$modal) {
			console.warn(`Modal "${this.ids.video}" does not exist`)
			return
		}

		const $iframeWrap = $modal.querySelector(this.selectors.iframe)
		const $iframe = this.#createVideoIframe(href)

		if (!$iframeWrap || !$iframe) {
			return
		}

		$iframeWrap.innerHTML = ''
		$iframeWrap.appendChild($iframe)

		this.open(this.ids.video, $trigger)
	}

	close(id) {
		const normalizedId = this.#normalizeId(id)
		const $modal = this.#getModalById(normalizedId)

		if (!$modal || !this.#isOpened(normalizedId)) {
			console.warn(`Modal "${normalizedId}" does not exist`)
			return
		}

		if ($modal.dataset.state === STATE.CLOSING || $modal.dataset.state === STATE.CLOSED) {
			return
		}

		this.#emit(EVENT.BEFORE_CLOSE, {
			id: normalizedId,
		})

		this.modals = this.modals.filter(item => item !== normalizedId)
		this.#setModalState($modal, STATE.CLOSING)

		this.#emit(EVENT.CLOSE, {
			id: normalizedId,
		})

		this.#waitForTransition($modal, () => {
			this.#setModalState($modal, STATE.CLOSED)
			this.#cleanupModal($modal)
			this.#restoreFocus(normalizedId)

			this.#emit(EVENT.AFTER_CLOSE, {
				id: normalizedId,
			})

			if (!this.modals.length) {
				this.#unlock()
			}
		})
	}
}
