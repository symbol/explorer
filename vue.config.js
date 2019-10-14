module.exports = {
  // base url
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',
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
