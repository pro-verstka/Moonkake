const declension = (oneNominative, severalGenitive, severalNominative, number) => {
	let num = number % 100

	// eslint-disable-next-line no-return-assign,no-nested-ternary,no-cond-assign
	return num <= 14 && num >= 11
		? severalGenitive
		: // eslint-disable-next-line no-cond-assign,no-nested-ternary
		(num %= 10) < 5
		? // eslint-disable-next-line no-nested-ternary
		  num > 2
			? severalNominative
			: // eslint-disable-next-line no-nested-ternary
			num === 1
			? oneNominative
			: num === 0
			? severalGenitive
			: severalNominative
		: severalGenitive
}

export default declension
