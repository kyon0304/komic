var webpackConfig = require('./webpack.config.js')

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt)
  grunt.initConfig({
    webpack: {
      options: webpackConfig
    , dist: { cache: false }
    }
  , 'webpack-dev-server': {
      options: {
        webpack: webpackConfig
      , contentBase: './src'
      , publicPath: '/assets/'
      , port: 8000
      , hot: true
      }
    , start: {
        keepalive: true
      , watch: true
      }
    }
  })
}
