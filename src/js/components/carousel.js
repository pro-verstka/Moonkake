import 'slick-carousel';
//import 'owl.carousel';

/* CAROUSEL
 -------------------------------------------------- */

	// $('.owl-carousel').owlCarousel({
	// 	items: 3,
	// 	loop: true,
	// 	margin: 0,
	// 	nav: true,
	// 	dots: true,
	// 	autoplay: true,
	// 	autoplayTimeout: 5000
	// });

	$('.carousel').slick({
		accessibility: false,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
		dots: true,
		infinite: true
	});
