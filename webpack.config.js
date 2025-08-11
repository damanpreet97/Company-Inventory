
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'renderer.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  target: 'web',
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\.css$/, use: ['style-loader','css-loader'] }
    ]
  },
  resolve: { extensions: ['.js','.jsx'] },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'public','index.html')
    })
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3000,
    hot: true
  }
};
