// Config
import '$config'

// Components
import { Accordion } from '$components/accordion'
import { Calendar } from '$components/calendar'
import { Counter } from '$components/counter'
import { Cursor } from '$components/cursor'
import { FieldFile } from '$components/field-file'
import { FullHeight } from '$components/fullheight'
import { Loader } from '$components/loader'
import { Tabs } from '$components/tabs'
import { Tooltip } from '$components/tooltip'

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

/* COUNTER
-------------------------------------------------- */

new Counter()

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

/* TOOLTIP
-------------------------------------------------- */

const $tooltips = document.querySelectorAll('[data-tippy]')

for (const $tooltip of $tooltips) {
	new Tooltip($tooltip)
}

/* FULLHEIGHT
-------------------------------------------------- */

const $fullheights = document.querySelectorAll('[data-fullheight]')

for (const $fullheight of $fullheights) {
	new FullHeight($fullheight)
}

/* LOADER
-------------------------------------------------- */

const $loader = document.querySelector('[data-loader]')

if ($loader) {
	new Loader($loader)
}
