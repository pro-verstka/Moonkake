import fs from 'node:fs'
import path from 'node:path'

export function createCheckReservedIndexPlugin(config) {
	return {
		name: 'check-reserved-index',
		buildStart() {
			checkReservedPageName(config)
		},
		configureServer() {
			checkReservedPageName(config)
		},
	}
}

function checkReservedPageName(config) {
	const reservedName = config.indexPageName.split('.')[0]
	const indexFile = path.resolve(config.root, `${reservedName}.${config.templateEngine}`)

	if (fs.existsSync(indexFile)) {
		console.error(
			`\n❌ Error: File "${reservedName}.${config.templateEngine}" found in src/.\n   The name "${reservedName}" is reserved and used for automatic generation of ${config.indexPageName}.\n   Please rename the file.\n`,
		)
		process.exit(1)
	}
}
