const gulp = require('gulp')
const fs = require('fs')
const path = require('path')
const { browserSync } = require('./taskBrowser')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const TerserPlugin = require('terser-webpack-plugin')
const { config, isProd } = require('./config')

function scripts() {
	const webpackConfig = {
		mode: isProd ? 'production' : 'development',
		entry: {},
		output: {
			filename: '[name].min.js'
		},
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: [/node_modules\/(?!(swiper|dom7)\/).*/, /\.test\.jsx?$/],
					use: [
						{
							loader: 'babel-loader'
						}
					]
				}
			]
		},
		resolve: {
			extensions: ['.js', '.json']
		},
		optimization: {
			minimize: isProd,
			minimizer: [
				new TerserPlugin({
					parallel: true,
					extractComments: false,
					terserOptions: {
						ecma: 5
					}
				})
			]
		}
	}

	fs.readdirSync('./src/js').forEach(file => {
		const name = `./src/js/${file}`

		if (!fs.statSync(name).isDirectory() && ['.js'].includes(path.extname(name))) {
			const filename = path.basename(name, path.extname(name))
			webpackConfig.entry[filename] = name
		}
	})

	if (config.separateJsToPages) {
		fs.readdirSync('./src/js/pages').forEach(file => {
			const name = `./src/js/pages/${file}`

			if (!fs.statSync(name).isDirectory() && ['.js'].includes(path.extname(name))) {
				const filename = path.basename(name, path.extname(name))
				webpackConfig.entry[filename] = name
			}
		})
	}

	if (!isProd) {
		webpackConfig.devtool = 'cheap-source-map'
	}

	return gulp
		.src(Object.values(webpackConfig.entry))
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest('dist/assets/js/'))
		.pipe(browserSync.stream())
}

module.exports = scripts
