const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
      contentBase: './dist'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};