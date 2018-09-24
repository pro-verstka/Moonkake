//import 'slick-carousel';
//import 'owl.carousel';
import Swiper from 'swiper';

/* CAROUSEL
 -------------------------------------------------- */

let slider = new Swiper('.swiper-container', {
	slidesPerView: 1,
	spaceBetween: 0,
	speed: 1500,
	effect: 'slide',

	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},

	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
		clickable: true
	},
});

// $('.owl-carousel').owlCarousel({
// 	items: 3,
// 	loop: true,
// 	margin: 0,
// 	nav: true,
// 	dots: true,
// 	autoplay: true,
// 	autoplayTimeout: 5000
// });

// $('.carousel').slick({
// 	accessibility: false,
// 	autoplay: true,
// 	autoplaySpeed: 5000,
// 	arrows: true,
// 	dots: true,
// 	infinite: true
// });
