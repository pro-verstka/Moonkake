import LazyLoad from 'vanilla-lazyload'

// https://www.andreaverlicchi.eu/lazyload/

const lazyLoadInstance = new LazyLoad({
	elements_selector: 'img:not(.swiper-lazy)',
	use_native: true
})

// if (typeof pdoPage === 'object') {
// 	pdoPage.callbacks['after'] = (config, response) => {
// 		document.querySelector(config.wrapper).removeAttribute('style')
// 		document.querySelector(config.wrapper).classList.remove('loading')

// 		lazyLoadInstance.update()
// 	}
// }
