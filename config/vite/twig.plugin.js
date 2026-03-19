import path from 'node:path'
import twig from '@vituum/vite-plugin-twig'

export function createTwigPlugin(config) {
	return twig({
		root: config.root,
		data: path.resolve(config.root, 'data/*.json'),
	})
}
