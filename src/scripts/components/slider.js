import Swiper from 'swiper'
import { Autoplay, EffectFade, Mousewheel, Navigation, Pagination } from 'swiper/modules'

/**
 * Swiper slider initializer with navigation, pagination, autoplay, and mousewheel modules.
 *
 * Markup:
 * <div class="swiper" data-slider>
 *   <div class="swiper-wrapper">
 *     <div class="swiper-slide">Slide</div>
 *   </div>
 *   <button class="swiper-button-prev" type="button"></button>
 *   <button class="swiper-button-next" type="button"></button>
 *   <div class="swiper-pagination"></div>
 * </div>
 *
 * @example
 * document.querySelectorAll('[data-slider]').forEach($el => new Slider($el))
 */
export class Slider {
	constructor($el) {
		if (!$el) {
			return
		}

		this.$root = $el

		this.#init()
	}

	#init() {
		this.#initSlider()
	}

	#initSlider() {
		this.slider = new Swiper(this.$root, {
			modules: [Navigation, Pagination, Autoplay, Mousewheel, EffectFade],
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 1000,
			effect: 'slide',
			loop: true,

			freeMode: true,
			freeModeSticky: true,
			mousewheel: {
				forceToAxis: true,
				invert: true,
			},

			preloadImages: false,

			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
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
				clickable: true,
			},
		})
	}
}
