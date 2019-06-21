import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

document.body.insertAdjacentHTML(
	'beforeend',
	`
	<div class="pswp">
		<div class="pswp__bg"></div>
		<div class="pswp__scroll-wrap">
			<div class="pswp__container">
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
				<div class="pswp__item"></div>
			</div>
			<div class="pswp__ui pswp__ui--hidden">
				<div class="pswp__top-bar">
					<div class="pswp__counter"></div>
					<button class="pswp__button pswp__button--close"></button>
					<button class="pswp__button pswp__button--fs"></button>
					<button class="pswp__button pswp__button--zoom"></button>
					<div class="pswp__preloader">
						<div class="pswp__preloader__icn">
							<div class="pswp__preloader__cut">
								<div class="pswp__preloader__donut"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
					<div class="pswp__share-tooltip"></div>
				</div>
				<button class="pswp__button pswp__button--arrow--left"></button>
				<button class="pswp__button pswp__button--arrow--right"></button>
				<div class="pswp__caption">
					<div class="pswp__caption__center"></div>
				</div>
			</div>
		</div>
	</div>
`
)

const pswpElement = document.querySelectorAll('.pswp')[0]

document.querySelectorAll('[data-gallery]').forEach($gallery => {
	let images = []

	let options = {
		closeOnScroll: false,
		showHideOpacity: false,
		bgOpacity: 0.8,
		history: false,

		index: 0
	}

	let $links = $gallery.querySelectorAll('a')

	$links.forEach($link => {
		const dimensions = $link.dataset.size.split('x')

		images.push({
			src: $link.getAttribute('href'),
			w: dimensions[0],
			h: dimensions[1]
		})
	})

	$links.forEach(($link, index) => {
		$link.addEventListener('click', function(e) {
			e.preventDefault()

			options.index = index

			const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options)
			gallery.init()
		})
	})
})
