import Swiper from 'swiper'

/* global MK */

/* SLIDER
 -------------------------------------------------- */

// eslint-disable-next-line no-unused-vars
const slider = new Swiper('.swiper-container', {
	slidesPerView: 1,
	spaceBetween: 0,
	speed: MK.animation.speed / 2,
	effect: 'slide',
	loop: true,

	freeMode: true,
	freeModeSticky: true,
	mousewheel: {
		forceToAxis: true,
		invert: true
	},

	preloadImages: false,

	lazy: {
		loadPrevNext: true,
		loadOnTransitionStart: true
	},

	autoplay: {
		delay: 5000,
		disableOnInteraction: false
	},

	// fadeEffect: {
	// 	crossFade: true
	// },

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},

	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true
	}
})
