// Config
import '$config'

// Components
import { Accordion } from '$components/accordion'
import { Calendar } from '$components/calendar'
import { Counter } from '$components/counter'
import { Cursor } from '$components/cursor'
import { Drawer } from '$components/drawer'
import { Field } from '$components/field'
import { FieldFile } from '$components/field-file'
import { FullHeight } from '$components/fullheight'
import { Gallery } from '$components/gallery'
import { Header } from '$components/header'
import { InputMask } from '$components/inputmask'
import { Loader } from '$components/loader'
import { ScrollAnimation } from '$components/scroll-animation'
import { ScrollBooster } from '$components/scrollbooster'
import { ScrollTo } from '$components/scrollto'
import { Spoiler } from '$components/spoiler'
import { Tabs } from '$components/tabs'
import { Tooltip } from '$components/tooltip'
import { Validation } from '$components/validation'

/* SETUP
-------------------------------------------------- */

// MK.addPlugins({ ...Components }, true)

/* SCROLL TO
-------------------------------------------------- */

new ScrollTo()

/* VALIDATION
-------------------------------------------------- */

new Validation()

/* GALLERY
-------------------------------------------------- */

new Gallery()

/* INPUTMASK
-------------------------------------------------- */

new InputMask()

/* SCROLL ANIMATION
-------------------------------------------------- */

new ScrollAnimation()

/* COUNTER
-------------------------------------------------- */

new Counter()

/* FIELD
-------------------------------------------------- */

new Field()

/* HEADER
-------------------------------------------------- */

const $header = document.querySelector('[data-header]')

if ($header) {
	new Header($header)
}

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

/* SPOILER
-------------------------------------------------- */

const $spoilers = document.querySelectorAll('[data-spoiler]')

for (const $spoiler of $spoilers) {
	new Spoiler($spoiler)
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

/* DRAWER
-------------------------------------------------- */

const $drawers = document.querySelectorAll('[data-drawer]')

for (const $drawer of $drawers) {
	new Drawer($drawer)
}

/* SCROLL BOOSTER
-------------------------------------------------- */

const $scrollBoosters = document.querySelectorAll('[data-scrollbooster]')

for (const $scrollBooster of $scrollBoosters) {
	new ScrollBooster($scrollBooster)
}
