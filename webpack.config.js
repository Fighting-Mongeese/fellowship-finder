const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, 'client/index.jsx'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  mode: 'none',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@emotion/react': require.resolve('@emotion/react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {

        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  // devtool: 'inline-source-map',
  // devServer: {
  //   historyApiFallback: true,
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:7000',
  //       logLevel: 'debug' /*optional*/
  //     }
  //   },
  //   port: 3000,
  //   static: './dist',
  //   hot: true,
  // },
  watchOptions: {
    aggregateTimeout: 1000, // Delay before rebuilding in milliseconds
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/index.html'),
      filename: 'index.html',
    }),
    new Dotenv()
  ]
};
