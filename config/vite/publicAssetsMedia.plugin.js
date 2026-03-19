import fs from 'node:fs'
import path from 'node:path'

export function createPublicAssetsMediaPlugin(config) {
	const publicRoot = path.resolve(config.public)
	const mediaRel = path.posix.join('assets', config.assets.media.dir)

	return {
		name: 'moonkake-public-assets-media',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const raw = req.url?.split('?')[0] ?? ''
				const prefix = publicAssetsMediaUrlPrefix(server.config.base, mediaRel)

				if (raw !== prefix && !raw.startsWith(`${prefix}/`)) {
					return next()
				}

				const suffix =
					raw === prefix || raw === `${prefix}/` ? '' : raw.slice(prefix.length + 1)

				if (!suffix) {
					return next()
				}

				let rel = suffix

				try {
					rel = decodeURIComponent(suffix)
				} catch {
					return next()
				}

				if (rel.includes('..') || path.isAbsolute(rel)) {
					return next()
				}

				const abs = path.resolve(publicRoot, rel)

				if (!abs.startsWith(publicRoot)) {
					return next()
				}

				fs.stat(abs, (err, st) => {
					if (err || !st.isFile()) {
						return next()
					}

					res.setHeader('Content-Type', 'application/octet-stream')
					fs.createReadStream(abs).pipe(res)
				})
			})
		},
		closeBundle() {
			if (!fs.existsSync(publicRoot)) {
				return
			}

			const dest = path.resolve(config.dist, ...mediaRel.split('/'))

			fs.mkdirSync(dest, { recursive: true })
			fs.cpSync(publicRoot, dest, { recursive: true })
		},
	}
}

function publicAssetsMediaUrlPrefix(viteBase, mediaRel) {
	let b = viteBase ?? '/'

	if (b === './' || b === '.' || b === '') {
		b = '/'
	}

	if (!b.startsWith('/')) {
		b = `/${b}`
	}

	b = b.replace(/\/$/, '')

	const tail = `/${mediaRel}`.replace(/\/+/g, '/')

	return b ? `${b}${tail}` : tail
}
