import twig from '@vituum/vite-plugin-twig'
import { loadTemplateData } from './templateData.util.js'

export function createTwigPlugin(config) {
	return twig({
		root: config.root,
		data: [],
		globals: {
			format: 'twig',
			...loadTemplateData(config.root),
		},
	})
}
