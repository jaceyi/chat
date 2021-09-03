const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',

  plugins: [
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      context: 'src'
    })
  ],

  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, '../public')
    },
    hot: 'only',
    allowedHosts: 'all',
    port: 2020
  }
});
