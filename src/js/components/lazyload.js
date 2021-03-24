import LazyLoad from 'vanilla-lazyload'

// https://www.andreaverlicchi.eu/vanilla-lazyload/

MK.addPlugins({ LazyLoad })

// if (typeof pdoPage === 'object') {
// 	pdoPage.callbacks['after'] = (config, response) => {
// 		document.querySelector(config.wrapper).removeAttribute('style')
// 		document.querySelector(config.wrapper).classList.remove('loading')

// 		MK.plugins.LazyLoad.update()
// 	}
// }

// if (window.jQuery) {
// 	$(document).on('mse2_load', function(e, data) {
// 		MK.plugins.LazyLoad.update()
// 	})
// }
