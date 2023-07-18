import PhotoSwipe from 'photoswipe'
// eslint-disable-next-line import/no-unresolved
import PhotoSwipeLightbox from 'photoswipe/lightbox'

export class Gallery {
	constructor() {
		this.#init()
	}

	#init() {
		this.#iniGallery()
	}

	#iniGallery() {
		this.gallery = new PhotoSwipeLightbox({
			gallery: '[data-gallery]',
			children: 'a',
			pswpModule: PhotoSwipe
		})

		this.gallery.init()
	}
}
