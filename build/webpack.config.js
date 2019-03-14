const path = require('path')
const webpack = require('webpack')
const os = require('os')
const merge = require('webpack-merge')
const argv = require('yargs-parser')(process.argv.slice(2))

const mode = argv.mode || 'development'
const interface = argv.interface || 'development'
const isEslint = !!argv.eslint
const isDev = mode === 'development'
const mergeConfig = require(`./config/webpack.${mode}.js`)

const CleanWebpackPlugin = require('clean-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const FirendlyErrorPlugin = require('friendly-errors-webpack-plugin')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreaPool({size: os.cpus().length})
const smp = new SpeedMeasurePlugin()

const loading = { html: "loading..." }

const apiConfig = {
  development: "http://xxxx/a",
  production: "http://xxx/b"
}

let commonConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['happypack/loader?id=babel'],
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          isDev ? 'style-loader': MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader?sourceMap=true',
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'url-loader'
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|ico)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.(csv|tsv)$/,
        use: [
          'csv-loader'
        ]
      },
      {
        test: /\.xml$/,
        use: [
          'xml-loader'
        ]
      },
      {
        test: /\.md$/,
        use: [
          "html-loader",
          "markdown-loader"
        ]
      }
    ]
  },
  resolue: {
    extensions: ['.js', '.jsx']
  }
}

