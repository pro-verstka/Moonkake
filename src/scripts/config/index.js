import { device, setViewportHeight } from '../helpers'

/* CONFIG
-------------------------------------------------- */

const MK = {
	info: {
		packageName: 'Moonkake',
		packageUrl: 'https://github.com/pro-verstka/Moonkake',
		version: '10.0.12',
		author: 'DevBrains',
		authorUrl: 'https://devbrains.io',
	},

	plugins: {},
	methods: {},
	data: {},

	addData(data = {}) {
		if (typeof data !== 'object') {
			return
		}

		this.data = {
			...this.data,
			...data,
		}
	},

	addMethods(methods = {}) {
		if (typeof methods !== 'object') {
			return
		}

		this.methods = {
			...this.methods,
			...methods,
		}
	},

	addPlugins(plugins = {}, asLink = true) {
		if (typeof plugins !== 'object') {
			return
		}

		for (const key of Object.keys(plugins)) {
			if (typeof plugins[key] === 'object') {
				this.plugins = {
					...this.plugins,
					[key]: plugins[key],
				}
			}

			if (typeof plugins[key] === 'function') {
				this.plugins[key] = asLink ? plugins[key] : new plugins[key]()
			}
		}
	},
}

window.MK = { ...MK, ...(window.MK || {}) }

/* HTML CLASSNAMES
-------------------------------------------------- */

const htmlClassNames = []

if (device.isMobile()) htmlClassNames.push('-device-mobile')
if (device.isTouch()) htmlClassNames.push('-device-touch')
if (device.isAndroid()) htmlClassNames.push('-device-android')
if (device.isIOS()) htmlClassNames.push('-device-ios')
if (device.isIPhone()) htmlClassNames.push('-device-iphone')
if (device.isIPad()) htmlClassNames.push('-device-ipad')

document.documentElement.classList.add(...htmlClassNames)

/* FONTS
-------------------------------------------------- */

if (!sessionStorage.fontsLoaded) {
	await Promise.all([document.fonts.load('FONT_NAME')]).then(() => {
		document.documentElement.classList.add('-fonts-ready')

		sessionStorage.fontsLoaded = true
	})
}

/* HELPERS
-------------------------------------------------- */

window.addEventListener('load', setViewportHeight)
window.addEventListener('resize', setViewportHeight)

/* CREDENTIALS
-------------------------------------------------- */

console.info(
	`%c Yay, you found what you were looking for! You want a cool website, check out ${MK.info.authorUrl}`,
	'padding: 10px; background-color: #282c34; color: #fff;',
)
