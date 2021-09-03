const path = require('path');
const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',

  devtool: 'source-map',

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: path.resolve(__dirname, '../public'),
          filter: resourcePath => {
            // 手动过滤 index.html
            return (
              resourcePath !== path.resolve(__dirname, '../public/index.html')
            );
          }
        }
      ]
    })
  ],

  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin({
        parallel: 4
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          priority: -10
        },
        default: {
          name: 'common',
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
});
