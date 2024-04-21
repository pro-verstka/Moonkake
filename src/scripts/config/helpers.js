import { isMobile, isTouch, setViewportHeight } from '@/scripts/helpers/index.js'

/* HTML CLASSNAMES
-------------------------------------------------- */

const htmlClassNames = []

if (isMobile()) htmlClassNames.push('-device-mobile')
if (isTouch()) htmlClassNames.push('-device-touch')
// if (isAndroid()) htmlClassNames.push('-device-android')
// if (isIOS()) htmlClassNames.push('-device-ios')
// if (isIPhone()) htmlClassNames.push('-device-iphone')
// if (isIPad()) htmlClassNames.push('-device-ipad')

document.documentElement.classList.add(...htmlClassNames)

/* HELPERS
-------------------------------------------------- */

setViewportHeight()
window.addEventListener('load', setViewportHeight)
window.addEventListener('resize', setViewportHeight)
