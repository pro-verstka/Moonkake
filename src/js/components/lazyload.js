import LazyLoad from 'vanilla-lazyload'

// https://www.andreaverlicchi.eu/lazyload/

// eslint-disable-next-line no-unused-vars
const lazyLoad = new LazyLoad({
	elements_selector: '.lazy',
	use_native: true
})

// if (typeof pdoPage === 'object') {
// 	pdoPage.callbacks['after'] = (config, response) => {
// 		document.querySelector(config.wrapper).removeAttribute('style')
// 		document.querySelector(config.wrapper).classList.remove('loading')

// 		lazyLoad.update()
// 	}
// }

// if (window.jQuery) {
// 	$(document).on('mse2_load', function(e, data) {
// 		lazyLoad.update()
// 	})
// }
