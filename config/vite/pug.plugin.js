import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'

export function createPugPlugin(config) {
	return pug({
		root: config.root,
		data: path.resolve(config.root, 'data/*.json'),
		options: {
			pretty: true,
		},
	})
}
