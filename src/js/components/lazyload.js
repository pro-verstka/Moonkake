import LazyLoad from 'vanilla-lazyload'

// https://www.andreaverlicchi.eu/lazyload/

const lazyLoadInstance = new LazyLoad({
	elements_selector: 'img:not(.swiper-lazy)',
	use_native: true
})