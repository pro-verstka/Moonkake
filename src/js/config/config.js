import Loader from '../libs/loader'
import { isMobile, isAndroid, isIOS, isIPad, isIPhone, isTouchDevice, setViewportHeight } from '../libs/utils'

/* SETUP
-------------------------------------------------- */

if (typeof window.MK === 'undefined') {
	window.MK = {
		version: '8.3.1',
		events: {
			load: 'load'
		},
		animation: {
			speed: isMobile() ? 500 : 1500
		},
		plugins: {}
	}
}

/* LOADER
-------------------------------------------------- */

MK.plugins.loader = new Loader()

if (MK.plugins.loader?.isInitialized) {
	MK.events.load = MK.plugins.loader.options.eventName
}

/* HTML CLASSNAMES
-------------------------------------------------- */

const htmlClassNames = []

if (isMobile()) htmlClassNames.push('-device-mobile')
if (isTouchDevice()) htmlClassNames.push('-device-touch')
if (isAndroid()) htmlClassNames.push('-device-android')
if (isIOS()) htmlClassNames.push('-device-ios')
if (isIPhone()) htmlClassNames.push('-device-iphone')
if (isIPad()) htmlClassNames.push('-device-ipad')

document.documentElement.classList.add(...htmlClassNames)

/* HELPERS
-------------------------------------------------- */

setViewportHeight()
window.addEventListener('resize', setViewportHeight)

console.info(
	'%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru',
	'padding: 10px; background-color: #282c34; color: #fff;'
)
