export default function declension(oneNominative, severalGenitive, severalNominative, number) {
	let num = number % 100

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
