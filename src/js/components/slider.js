import Swiper from 'swiper'

/* SLIDER
 -------------------------------------------------- */

const slider = new Swiper('.swiper-container', {
	slidesPerView: 1,
	spaceBetween: 0,
	speed: 1500,
	effect: 'slide',
	loop: true,

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
		prevEl: '.swiper-button-prev',
	},

	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true
	},
})