import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_THEME = 'color-dark,background-light'

class Header {
	constructor() {
		this.$header = document.querySelector('[data-header]')
		this.$themes = document.querySelectorAll('[data-header-theme]')

		if (!this.$header && !this.$themes.length) {
			return
		}

		this.init()
	}

	init() {
		this.setTheme()
		this.toggleThemeHandler()
	}

	get headerHeight() {
		return this.$header.clientHeight
	}

	setTheme(themes = DEFAULT_THEME) {
		this.$header.setAttribute('data-header', themes)
	}

	toggleThemeHandler() {
		if (!this.$themes.length) {
			return
		}

		this.$themes.forEach($theme => {
			const theme = $theme.dataset.headerTheme || DEFAULT_THEME
			const $parent = $theme.parentElement.closest('[data-header-theme]')
			const parentTheme = $parent ? $parent.dataset.headerTheme : DEFAULT_THEME

			ScrollTrigger.create({
				trigger: $theme,
				start: () => `top ${this.headerHeight}px`,
				end: () => `bottom ${this.headerHeight}px`,
				invalidateOnRefresh: true,
				onToggle: () => this.setTheme(theme),
				onLeave: () => this.setTheme(parentTheme),
				onLeaveBack: () => this.setTheme()
			})
		})
	}
}

export default Header
