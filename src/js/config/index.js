import { Device, setViewportHeight } from '../helpers'
// import { Loader } from '../libs'

/* SETUP
-------------------------------------------------- */

const MK = {
	info: {
		packageName: 'Moonkake',
		packageUrl: 'https://github.com/detectiveshelby/Moonkake',
		version: '8.7.0',
		author: 'DevBrains',
		authorUrl: 'https://devbrains.io'
	},

	settings: {
		event: {
			load: 'load'
		},
		animation: {
			speed: 1000
		}
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

/* LOADER
-------------------------------------------------- */

// MK.addPlugins({Loader})
//
// if (MK.plugins.Loader?.isInitialized) {
// 	MK.settings.events.load = MK.plugins.Loader.options.eventName
// }

/* HTML CLASSNAMES
-------------------------------------------------- */

const htmlClassNames = []

if (Device.isMobile()) htmlClassNames.push('-device-mobile')
if (Device.isTouch()) htmlClassNames.push('-device-touch')
if (Device.isAndroid()) htmlClassNames.push('-device-android')
if (Device.isIOS()) htmlClassNames.push('-device-ios')
if (Device.isIPhone()) htmlClassNames.push('-device-iphone')
if (Device.isIPad()) htmlClassNames.push('-device-ipad')

document.documentElement.classList.add(...htmlClassNames)

/* HELPERS
-------------------------------------------------- */

window.addEventListener('load', setViewportHeight)
window.addEventListener('resize', setViewportHeight)

console.info(
	`%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на ${MK.info.authorUrl}`,
	'padding: 10px; background-color: #282c34; color: #fff;'
)
