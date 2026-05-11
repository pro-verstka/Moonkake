import { Select } from '$components/select'
import { Slider } from '$components/slider'

import '$components/map'

for (const $select of document.querySelectorAll('.select')) {
	new Select($select)
}

for (const $slider of document.querySelectorAll('[data-slider]')) {
	new Slider($slider)
}
