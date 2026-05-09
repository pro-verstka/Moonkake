import PhotoSwipe from 'photoswipe'
import PhotoSwipeLightbox from 'photoswipe/lightbox'

/**
 * PhotoSwipe lightbox initializer.
 *
 * Markup:
 * <div data-gallery>
 *   <a href="image-full.jpg" data-pswp-width="1200" data-pswp-height="800">
 *     <img src="image-thumb.jpg" alt="">
 *   </a>
 * </div>
 *
 * @example
 * new Gallery()
 *
 * new Gallery('[data-product-gallery]')
 */
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
			pswpModule: PhotoSwipe,
			showHideAnimationType: 'fade',
		})

		this.gallery.init()
	}
}
