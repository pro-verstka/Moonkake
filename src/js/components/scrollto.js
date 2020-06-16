import { scrollTo } from './../libs/utils'

/* SCROLL TO
-------------------------------------------------- */

document.addEventListener('click', e => {
	if (e.target.matches('[data-scroll-to]') || e.target.closest('[data-scroll-to]')) {
		e.preventDefault()

		const $el = e.target.matches('[data-scroll-to]') ? e.target : e.target.closest('[data-scroll-to]')

		scrollTo($el.getAttribute('href'), {
			offset: $el.dataset.scrollToOffset || 0
		})
	}
})
