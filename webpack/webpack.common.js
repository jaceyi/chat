const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, { production = false } = {}) => {
  const modePath = production ? '.[contenthash]' : '';
  const assetPath = `static/assets/[name]${modePath}[ext]`;

  return {
    entry: path.resolve(__dirname, '../src/'),

    output: {
      filename: 'static/scripts/[name].[contenthash].bundle.js',
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/'
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        '@': path.resolve(__dirname, '../src/'),
        chatUtils: path.resolve(__dirname, '../src/components/Chat/utils/')
      }
    },

    cache: {
      type: 'filesystem',
      allowCollectingMemory: true
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../src/index.html')
      }),
      new MiniCssExtractPlugin({
        filename: `static/styles/[name]${modePath}.css`,
        chunkFilename: `static/styles/[id]${modePath}.css`
      }),
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            context: path.resolve(__dirname, '../public/')
          }
        ]
      })
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader'
        },
        {
          test: /\.jsx?/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        },
        {
          test: /\.scss$/,
          include: /src/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                esModule: false
              }
            },
            {
              loader: 'css-loader',
              options: {
                esModule: false,
                modules: {
                  localIdentName: '[path]_[local]__[hash:base64:5]',
                  auto: true
                }
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(css)$/,
          include: /node_modules/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        },
        {
          type: 'javascript/auto',
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: assetPath
          }
        },
        {
          test: /\.(eot|ttf|woff)$/,
          type: 'asset/resource',
          generator: {
            filename: assetPath
          }
        }
      ]
    },
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
  };
};
