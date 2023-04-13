const pkg = require('./package.json');

const path = require('path');

const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = {
  entry: './src/index.ts',
  output: {
    library: {
      name: pkg.name,
      type: 'umd',
    },
    path: path.resolve(__dirname, './dist'),
    filename: 'index.esm.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // mode: process.env.NODE_ENV,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.svg$/,
        use: ['raw-loader'],
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true,
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                },
                minify: true,
              }),
            },
          },
        ],
      },
    ],
  },
};
