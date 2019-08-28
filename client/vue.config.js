const path = require('path')
module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
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
