export const emitEvent = (name, detail = {}, target = window) => {
	target.dispatchEvent(
		new CustomEvent(name, {
			bubbles: true,
			detail,
		}),
	)
}
