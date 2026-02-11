// Config
import '$config'

// Components
import { Accordion, Cursor, Tabs } from '$components'

/* SETUP
-------------------------------------------------- */

// MK.addPlugins({ ...Components }, true)

/* ACCORDION
-------------------------------------------------- */

const $accordions = document.querySelectorAll('[data-accordion]')

for (const $accordion of $accordions) {
	new Accordion($accordion)
}

/* TABS
-------------------------------------------------- */

const $tabs = document.querySelectorAll('[data-tabs]')

for (const $tab of $tabs) {
	new Tabs($tab)
}

/* CURSOR
-------------------------------------------------- */

const $cursor = document.querySelector('[data-cursor]')

if ($cursor) {
	new Cursor($cursor)
}
