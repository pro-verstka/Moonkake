import gulp from 'gulp'
import fs from 'node:fs'
import path from 'node:path'
import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import TerserPlugin from 'terser-webpack-plugin'
import { browserSync } from './taskBrowser.mjs'
import { config, isProd } from './config.mjs'

export function scripts() {
	const webpackConfig = {
		mode: isProd ? 'production' : 'development',
		entry: {},
		output: {
			filename: '[name].min.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: 'swc-loader'
					}
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
