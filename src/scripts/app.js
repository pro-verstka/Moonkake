// Config
import '$config'

// Components
import { Accordion } from '$components'

/* SETUP
-------------------------------------------------- */

// MK.addPlugins({ ...Components }, true)

/* ACCORDION
-------------------------------------------------- */

const $accordions = document.querySelectorAll('[data-accordion]')

for (const $accordion of $accordions) {
	new Accordion($accordion)
}
