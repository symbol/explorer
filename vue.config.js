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
    port: 8080,
    before: app => {
    }
  }
}
