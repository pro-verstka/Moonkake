import { device, setViewportHeight } from '../helpers'

/* SETUP
-------------------------------------------------- */

const MK = {
	info: {
		packageName: 'Moonkake',
		packageUrl: 'https://github.com/detectiveshelby/Moonkake',
		version: '8.9.0',
		author: 'DevBrains',
		authorUrl: 'https://devbrains.io'
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
			...data
		}
	},

	addMethods(methods = {}) {
		if (typeof methods !== 'object') {
			return
		}

		this.methods = {
			...this.methods,
			...methods
		}
	},

	addPlugins(plugins = {}, asLink = false) {
		if (typeof plugins !== 'object') {
			return
		}

		Object.keys(plugins).forEach(key => {
			if (typeof plugins[key] === 'object') {
				this.plugins = {
					...this.plugins,
					[key]: plugins[key]
				}
			}

			if (typeof plugins[key] === 'function' && !asLink) {
				this.plugins[key] = new plugins[key]()
			}

			if (typeof plugins[key] === 'function' && asLink) {
				this.plugins[key] = plugins[key]
			}
		})
	}
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

/* HELPERS
-------------------------------------------------- */

window.addEventListener('load', setViewportHeight)
window.addEventListener('resize', setViewportHeight)

console.info(
	`%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на ${MK.info.authorUrl}`,
	'padding: 10px; background-color: #282c34; color: #fff;'
)
