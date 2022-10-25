const declension = (oneNominative, severalGenitive, severalNominative, number) => {
	let num = number % 100

	// eslint-disable-next-line no-return-assign,no-nested-ternary,no-cond-assign
	return num <= 14 && num >= 11
		? severalGenitive
		: (num %= 10) < 5
		? num > 2
			? severalNominative
			: num === 1
			? oneNominative
			: num === 0
			? severalGenitive
			: severalNominative
		: severalGenitive
}

export default declension
