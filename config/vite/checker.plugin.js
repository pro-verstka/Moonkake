import checker from 'vite-plugin-checker'

export function createCheckerPlugin() {
	return checker({
		biome: {
			command: 'check',
		},
	})
}
