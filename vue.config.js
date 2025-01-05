// Read config files that may not exist.
const webpack = require('webpack');

module.exports = {
	// base url
	publicPath: '/',
	// output dir
	outputDir: './www',
	// eslint-loader check
	lintOnSave: true,
	// webpack-dev-server
	devServer: {
		host: '0.0.0.0',
		port: 8080
	},
	css: {
		// modules: true,
		loaderOptions: {
			sass: {
				prependData: '@import "~@/styles/variables.scss";'
			}
		}
	},
	configureWebpack: {
		resolve: {
			fallback: {
				https: require.resolve('https-browserify'),
				http: require.resolve('stream-http'),
				crypto: require.resolve('crypto-browserify'),
				stream: require.resolve('stream-browserify'),
				zlib: require.resolve('browserify-zlib'),
				querystring: require.resolve('querystring-es3'),
				path: require.resolve('path-browserify'),
				vm: require.resolve('vm-browserify'),
				fs: false,
				vm: false,
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				process: 'process/browser',
				Buffer: ['buffer', 'Buffer'],
			})
		]
	}
};
