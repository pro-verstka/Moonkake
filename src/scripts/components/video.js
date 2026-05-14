import { emitEvent } from '$helpers'

const STATE = {
	IDLE: 'idle',
	PLAYING: 'playing',
}

const EVENT = {
	BEFORE_PLAY: 'mk:video:beforePlay',
	PLAY: 'mk:video:play',
}

const IFRAME_DEFAULT_PARAMS = {
	allowfullscreen: 'allowfullscreen',
	frameborder: '0',
	allow: 'autoplay; fullscreen',
}

const YT_MAXRES_FALLBACK_WIDTH = 121

export const youtubeVideoEmbedPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
	let id = ''

	if (url.hostname.includes('youtube.com')) {
		if (url.pathname.includes('/embed/')) {
			id = url.pathname.replace('/embed/', '').replace(/\/$/, '')
		} else {
			id = url.searchParams.get('v') || ''
		}
	}

	if (url.hostname.includes('youtu.be')) {
		id = url.pathname.replace('/', '')
	}

	if (!id) {
		return null
	}

	return {
		thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
		thumbnailFallback: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
		iframe: {
			...iframeDefaults,
			src: `https://www.youtube.com/embed/${id}?autoplay=1`,
		},
	}
}

export const vimeoVideoEmbedPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
	if (!url.hostname.includes('vimeo.com')) {
		return null
	}

	const id = url.pathname.replace(/[^0-9]/g, '')

	if (!id) {
		return null
	}

	return {
		thumbnail: null,
		iframe: {
			...iframeDefaults,
			src: `https://player.vimeo.com/video/${id}?autoplay=1`,
		},
	}
}

export const rutubeVideoEmbedPlugin = (url, iframeDefaults = IFRAME_DEFAULT_PARAMS) => {
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
		thumbnail: null,
		iframe: {
			...iframeDefaults,
			src,
		},
	}
}

/**
 * Lazy video embed: shows poster + play button, swaps to iframe on click.
 *
 * Markup:
 * <div data-video data-video-url="https://www.youtube.com/watch?v=ID"></div>
 * <div data-video data-video-url="https://vimeo.com/ID" data-video-poster="/img/poster.jpg"></div>
 *
 * Emits `mk:video:beforePlay` and `mk:video:play`.
 *
 * @example
 * document.querySelectorAll('[data-video]').forEach($el => new Video($el, {
 *   videoPlugins: [youtubeVideoEmbedPlugin, vimeoVideoEmbedPlugin, rutubeVideoEmbedPlugin],
 * }))
 */
export class Video {
	constructor($el, options = {}) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.options = {
			selectors: {
				poster: '[data-video-poster]',
				play: '[data-video-play]',
			},
			videoPlugins: [],
			labels: {
				play: 'Play video',
			},
			iframeParams: IFRAME_DEFAULT_PARAMS,
		}

		if (typeof options === 'object') {
			this.options = {
				...this.options,
				...options,
				selectors: {
					...this.options.selectors,
					...(options.selectors || {}),
				},
				labels: {
					...this.options.labels,
					...(options.labels || {}),
				},
				iframeParams: {
					...this.options.iframeParams,
					...(options.iframeParams || {}),
				},
			}
		}

		this.selectors = this.options.selectors

		if (this.$root.dataset.initialized === 'true') {
			return
		}

		this.url = this.$root.dataset.videoUrl || ''
		this.posterOverride = this.$root.dataset.videoPoster || ''
		this.altText = this.$root.dataset.videoAlt || ''

		const parsedUrl = this.#parseUrl(this.url)

		if (!parsedUrl) {
			console.warn('[Video] Invalid or missing data-video-url', this.$root)
			return
		}

		this.parsed = this.#resolve(parsedUrl)

		if (!this.parsed) {
			console.warn('[Video] No plugin matched URL', this.url)
			return
		}

		this.#init()
	}

	#parseUrl(value) {
		if (!value) {
			return null
		}

		try {
			return new URL(value)
		} catch {
			return null
		}
	}

	#resolve(url) {
		for (const plugin of this.options.videoPlugins) {
			const result = plugin(url, this.options.iframeParams)

			if (result) {
				return result
			}
		}

		return null
	}

	#init() {
		this.#renderPoster()
		this.#setupListeners()

		this.$root.dataset.state = STATE.IDLE
		this.$root.dataset.initialized = 'true'
	}

	#renderPoster() {
		const posterSrc = this.posterOverride || this.parsed.thumbnail

		if (posterSrc) {
			const $img = document.createElement('img')
			$img.setAttribute('data-video-poster', '')
			$img.src = posterSrc
			$img.alt = this.altText
			$img.loading = 'lazy'

			if (!this.posterOverride && this.parsed.thumbnailFallback) {
				$img.addEventListener(
					'load',
					() => {
						if ($img.naturalWidth < YT_MAXRES_FALLBACK_WIDTH) {
							$img.src = this.parsed.thumbnailFallback
						}
					},
					{ once: true },
				)
			}

			this.$root.appendChild($img)
		}

		const $button = document.createElement('button')
		$button.type = 'button'
		$button.setAttribute('data-video-play', '')
		$button.setAttribute('aria-label', this.options.labels.play)

		const $icon = document.createElement('span')
		$icon.setAttribute('data-video-play-icon', '')
		$button.appendChild($icon)

		this.$root.appendChild($button)

		this.$poster = this.$root.querySelector(this.selectors.poster)
		this.$play = $button
	}

	#setupListeners() {
		this.$root.addEventListener('click', () => this.play())
	}

	play() {
		if (this.$root.dataset.state === STATE.PLAYING) {
			return
		}

		emitEvent(EVENT.BEFORE_PLAY, {
			root: this.$root,
			url: this.url,
		})

		const $iframe = document.createElement('iframe')

		for (const [name, value] of Object.entries(this.parsed.iframe)) {
			$iframe.setAttribute(name, value)
		}

		this.$root.replaceChildren($iframe)
		this.$root.dataset.state = STATE.PLAYING

		$iframe.focus()

		emitEvent(EVENT.PLAY, {
			root: this.$root,
			url: this.url,
		})
	}
}
