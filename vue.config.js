const path = require('path')
module.exports = {
  // mode: 'production',
  outputDir: path.resolve(__dirname, '../public'),
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  devServer: {
    proxy: {
      'api': {
        target: 'http://localhost:3000/'
      }
    }
  }
}
