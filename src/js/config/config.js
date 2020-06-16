import Loader from './../libs/loader'
import { isMobile, isAndroid, isIOS, isIPad, isIPhone, isTouchDevice } from './../libs/utils'

/* SETUP
-------------------------------------------------- */

if (typeof window.MK === 'undefined') {
	window.MK = {
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

window.MK.plugins.loader = new Loader()

if (window.MK.plugins.loader?.isInitialized) {
	window.MK.events.load = window.MK.plugins.loader.options.eventName
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

// if IE
//htmlClassNames.forEach(className => document.documentElement.classList.add(className))

document.documentElement.classList.add(...htmlClassNames)

console.info(
	'%c Ура, вы нашли то, что искали! Хотите крутой сайт - заходите на https://devbrains.ru',
	'padding: 10px; background-color: #282c34; color: #fff;'
)