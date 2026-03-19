import fs from 'node:fs'
import path from 'node:path'

export function getEntries(root) {
	const entries = new Set()

	for (const file of fs.readdirSync(root)) {
		if (file.endsWith('.pug') || file.endsWith('.twig')) {
			entries.add(file)
			continue
		}

		if (file.endsWith('.pug.html') || file.endsWith('.twig.html')) {
			entries.add(file.replace(/\.html$/, ''))
		}
	}

	return [...entries]
}

export function getInput(root, entries) {
	return entries.map(tpl => path.resolve(root, `${tpl}.html`))
}
