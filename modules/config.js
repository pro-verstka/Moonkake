const config = {
	separateCssToPages: true,
	separateJsToPages: true,
	appendFontsToHead: true
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = { config, isProd }
