const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = env => {
  return merge(
    common(env, {
      production: true
    }),
    {
      mode: 'production',

      devtool: 'source-map',

      plugins: [new CleanWebpackPlugin()]
    }
  );
};
