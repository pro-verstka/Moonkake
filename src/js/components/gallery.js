// eslint-disable-next-line import/no-unresolved
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import PhotoSwipe from 'photoswipe'

const lightbox = new PhotoSwipeLightbox({
	gallery: '[data-gallery]',
	children: 'a',
	pswpModule: PhotoSwipe
})

lightbox.init()
