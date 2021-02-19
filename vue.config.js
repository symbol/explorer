module.exports = {
	lintOnSave: true,
	devServer: {
		host: '0.0.0.0',
		port: 8080
	},
	css: {
		extract: false,
		loaderOptions: {
			sass: {
				prependData: `@import "~@/styles/variables.scss";`
			}
		}
	}
};
