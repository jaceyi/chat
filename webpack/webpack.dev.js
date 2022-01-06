const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = env => {
  return merge(common(env), {
    mode: 'development',

    devtool: 'inline-source-map',

    plugins: [
      new ESLintPlugin({
        extensions: ['.js', '.jsx']
      }),
      new ReactRefreshWebpackPlugin({
        include: /\.jsx?/
      })
    ],

    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.resolve(__dirname, '../public')
      },
      hot: true,
      allowedHosts: 'all',
      proxy: {},
      port: 2020
    }
  });
};
