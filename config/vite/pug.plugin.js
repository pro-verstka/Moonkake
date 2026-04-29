import pug from '@vituum/vite-plugin-pug'
import { loadTemplateData } from './templateData.util.js'

export function createPugPlugin(config) {
	return pug({
		root: config.root,
		data: [],
		globals: {
			format: 'pug',
			...loadTemplateData(config.root),
		},
		options: {
			pretty: true,
		},
	})
}
