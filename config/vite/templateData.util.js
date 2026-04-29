import fs from 'node:fs'
import path from 'node:path'

export function loadTemplateData(root) {
	const dir = path.resolve(root, 'data')

	if (!fs.existsSync(dir)) return {}

	const data = {}

	for (const file of fs.readdirSync(dir)) {
		if (!file.endsWith('.json')) continue

		const full = path.join(dir, file)

		Object.assign(data, JSON.parse(fs.readFileSync(full, 'utf8')))
	}

	return data
}
