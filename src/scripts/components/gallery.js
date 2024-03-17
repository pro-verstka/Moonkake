import PhotoSwipeLightbox from 'photoswipe/lightbox'

export class Gallery {
	constructor(selector = '[data-gallery]') {
		this.selector = selector

		this.#init()
	}

	#init() {
		this.#iniGallery()
	}

	#iniGallery() {
		this.gallery = new PhotoSwipeLightbox({
			gallery: this.selector,
			children: 'a',
			pswpModule: import('photoswipe'),
		})

		this.gallery.init()
	}
}
