import path from 'node:path'

export function createPathUtils(config) {
	return {
		withAssets: url =>
			path.relative(config.projectRoot, path.resolve(config.projectRoot, 'assets', url)),
		withStyles: url => path.resolve(config.root, `${config.assets.styles.dir}/${url}`),
		withScripts: url => path.resolve(config.root, `${config.assets.scripts.dir}/${url}`),
	}
}
