const path = require('path');

module.exports = {
  entry: './src/main.js', // The first file to look into. Move your JavaScript here!
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'public/dist'), // We will put the compiled file into public/dist
    filename: "bundle.js"
  },
  module: {
    rules: [
      { // This section tells Webpack to use Babel to translate your React into JavaScript
        test: /\.js$/, // Regex for all JavaScript file
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          'presets': ['@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
    ],
  },
};