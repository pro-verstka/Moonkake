export const $ = (selector, parent) => (parent || document).querySelector(selector)
export const $$ = (selector, parent) => [...(parent || document).querySelectorAll(selector)]

// export const $on = (eventNames, selector, handler, options) => {
// 	if (!selector || !eventNames || !handler) return
//
// 	eventNames.split(' ').forEach(eventName => {
// 		document.addEventListener(eventName, (e) => {
// 			let element
//
// 			if (e.target.matches(selector)) element = e.target
// 			if (e.target.closest(selector)) element = e.target.closest(selector)
//
// 			if (!element) return
//
// 			handler(e, element)
// 		}, options)
// 	})
// }
