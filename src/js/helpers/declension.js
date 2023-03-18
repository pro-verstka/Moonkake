const declension = (oneNominative, severalGenitive, severalNominative, number) => {
	let num = number % 100

	if (num <= 14 && num >= 11) return severalGenitive

	num %= 10

	if (num < 5) {
		if (num > 2) return severalNominative
		if (num === 1) return oneNominative
		if (num === 0) return severalGenitive

		return severalNominative
	}

	return severalGenitive
}

export default declension
