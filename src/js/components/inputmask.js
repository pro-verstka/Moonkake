import Inputmask from 'inputmask'

/* INPUTMASK
-------------------------------------------------- */

Inputmask({
	mask: '+7 (999) 999-99-99',
	clearIncomplete: true
}).mask(document.querySelectorAll('input[type="tel"]'))

Inputmask({
	inputFormat: 'dd.mm.yyyy',
	alias: 'datetime',
	placeholder: 'дд.мм.гггг',
	clearIncomplete: true
}).mask(document.querySelectorAll('input[data-mask-date]'))

Inputmask({
	rightAlign: false,
	alias: 'integer',
	allowMinus: false
}).mask(document.querySelectorAll('input[data-mask-number]'))
