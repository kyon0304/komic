var webpack = require('webpack')
  , path = require('path')
  , js_root = path.join(__dirname, 'src')
  , bower_components = path.join(__dirname, 'bower_components')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , assign = Object.assign || require('object.assign');

module.exports = function(options) {
  options = options || { production: undefined }

  return {
    context: js_root
  , entry: [
      'webpack/hot/only-dev-server'
    , path.join(js_root, 'main.js')
    ]
  , output: assign({
      filename: '[name].js'
    , publicPath: '/'
    }, options.production && { path: 'dist' })
  , resolve: {
      root: [js_root, bower_components]
    , modulesDirectories: ["node_modules", "bower_components"]
    }
  , module: {
      loaders: [
        { test: /\.(js|jsx)$/
        , exclude: /node_modules/
        , loader: 'react-hot!babel-loader'
        , include: js_root
        }
      , { test: /\.styl/
        , loader: 'style-loader!css-loader!stylus-loader' }
      , { test: /\.css$/
        , loader: 'style-loader!css-loader' }
      , { test: /\.(png|jpg|woff|woff2)$/
        , loader: 'url-loader?limit=8192'
        }
      ]
    }
  , babel: {
     optional: ["runtime", "es7.functionBind", "es7.decorators", "es7.objectRestSpread"]
    }
  , stylus: {
      use: [ (require('nib'))() ]
    }
  , plugins: [
      new webpack.HotModuleReplacementPlugin()
    , new webpack.NoErrorsPlugin()
    , new webpack.ResolverPlugin(
        new webpack.ResolverPlugin
          .DirectoryDescriptionFilePlugin("bower.json", ["main"])
      )
    , new HtmlWebpackPlugin()
    ]
  }
}
