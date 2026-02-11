// Config
import '$config'

// Components
import { Accordion } from '$components/accordion'
import { Calendar } from '$components/calendar'
import { Cursor } from '$components/cursor'
import { FieldFile } from '$components/field-file'
import { Tabs } from '$components/tabs'

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

/* CALENDAR
-------------------------------------------------- */

const $calendars = document.querySelectorAll('[data-calendar]')

for (const $calendar of $calendars) {
	new Calendar($calendar)
}

/* FILE
-------------------------------------------------- */

const $files = document.querySelectorAll('[data-file]')

for (const $file of $files) {
	new FieldFile($file)
}
