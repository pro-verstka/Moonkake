export default function setViewportHeight() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}
