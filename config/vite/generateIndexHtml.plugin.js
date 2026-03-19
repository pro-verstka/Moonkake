import fs from 'node:fs'
import path from 'node:path'
import { generateTemplate } from './generateTemplate.util.js'

export function createGenerateIndexHtmlPlugin({ config, entries }) {
	return {
		name: 'generate-index-html',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = req.url?.split('?')[0]

				if (url === '/' || url === '/index.html') {
					res.setHeader('Content-Type', 'text/html')
					res.end(createGeneratedIndexHtml(config, entries))
					return
				}

				next()
			})
		},
		closeBundle() {
			fs.writeFileSync(
				path.resolve(config.dist, config.indexPageName),
				createGeneratedIndexHtml(config, entries),
			)
		},
	}
}

function createGeneratedIndexHtml(config, entries) {
	const templates = entries.filter(tpl => tpl !== config.indexPageName).entries()

	return generateTemplate(templates)
}
