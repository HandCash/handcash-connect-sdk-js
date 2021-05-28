const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
   plugins: [
      new NodePolyfillPlugin(),
   ],
   entry: './src/index.js',
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'handcash-connect.js',
      library: 'handcash',
   },
};
