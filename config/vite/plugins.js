import fs from 'node:fs'
import path from 'node:path'
import pug from '@vituum/vite-plugin-pug'
import twig from '@vituum/vite-plugin-twig'
import checker from 'vite-plugin-checker'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { generateTemplate } from './utils.js'

export function getPlugins({ config, entries, packageJson }) {
	return [
		createCheckReservedIndexPlugin(config),
		checker({
			biome: {
				command: 'check',
			},
		}),
		pug({
			root: config.root,
			data: path.resolve(config.root, 'data/*.json'),
			options: {
				pretty: true,
			},
		}),
		twig({
			root: config.root,
			data: path.resolve(config.root, 'data/*.json'),
		}),
		viteStaticCopy({
			silent: true,
			structured: false,
			targets: [
				{
					src: path.resolve(config.public, '*'),
					dest: config.dist,
				},
			],
		}),
		createAsciiBannerPlugin(packageJson),
		createGenerateIndexHtmlPlugin({ config, entries }),
	]
}

function createCheckReservedIndexPlugin(config) {
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

function createAsciiBannerPlugin(packageJson) {
	return {
		name: 'ascii-banner',
		configureServer() {
			printBanner(packageJson, 'Powered by Moonkake')
		},
		closeBundle() {
			printBanner(packageJson, 'Powered by Moonkake')
		},
	}
}

function createGenerateIndexHtmlPlugin({ config, entries }) {
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

function printBanner(packageJson, text = '') {
	console.log(`
\x1b[36m  ███╗   ███╗ ██████╗  ██████╗ ███╗   ██╗██╗  ██╗ █████╗ ██╗  ██╗███████╗
  ████╗ ████║██╔═══██╗██╔═══██╗████╗  ██║██║ ██╔╝██╔══██╗██║ ██╔╝██╔════╝
  ██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║█████╔╝ ███████║█████╔╝ █████╗
  ██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║██╔═██╗ ██╔══██║██╔═██╗ ██╔══╝
  ██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║██║  ██╗██║  ██║██║  ██╗███████╗
  ╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝\x1b[0m
\x1b[90m  ${text} v${packageJson.version}\x1b[0m
`)
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
