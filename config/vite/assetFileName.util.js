import path from 'node:path'

export function getAssetFileName(asset) {
	if (typeof asset.name === 'string' && asset.name.length > 0) {
		return asset.name
	}

	if (Array.isArray(asset.names) && typeof asset.names[0] === 'string' && asset.names[0].length > 0) {
		return asset.names[0]
	}

	if (
		Array.isArray(asset.originalFileNames) &&
		typeof asset.originalFileNames[0] === 'string' &&
		asset.originalFileNames[0].length > 0
	) {
		return path.basename(asset.originalFileNames[0])
	}

	return 'asset'
}
