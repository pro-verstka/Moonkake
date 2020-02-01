import LazyLoad from 'vanilla-lazyload'

// https://www.andreaverlicchi.eu/lazyload/

const lazyLoadInstance = new LazyLoad({
	elements_selector: '.lazy',
	use_native: true
})

// if (typeof pdoPage === 'object') {
// 	pdoPage.callbacks['after'] = (config, response) => {
// 		document.querySelector(config.wrapper).removeAttribute('style')
// 		document.querySelector(config.wrapper).classList.remove('loading')

// 		lazyLoadInstance.update()
// 	}
// }

// if (window.jQuery) {
// 	$(document).on('mse2_load', function(e, data) {
// 		lazyLoadInstance.update()
// 	})
// }
