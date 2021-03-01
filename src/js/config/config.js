// import Loader from '../libs/loader'
import { Device, setViewportHeight } from '../helpers'

/* SETUP
-------------------------------------------------- */

const MK = {
	version: '8.4.1',
	events: {
		load: 'load'
	},
	animation: {
		speed: Device.isMobile() ? 500 : 1500
	},
	plugins: {}
}

if (typeof window.MK === 'undefined') {
	window.MK = MK
}

/* LOADER
-------------------------------------------------- */

// MK.plugins.loader = new Loader()
//
// if (MK.plugins.loader?.isInitialized) {
// 	MK.events.load = MK.plugins.loader.options.eventName
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
	'%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru',
	'padding: 10px; background-color: #282c34; color: #fff;'
)
