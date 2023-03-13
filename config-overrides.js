const { addWebpackModuleRule, override } = require('customize-cra');
// Use the `tap` function to output the config files for debugging.
// const { addWebpackModuleRule, adjustStyleLoaders, override, tap} = require('customize-cra');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');

module.exports = override(
  // Outputs current config to "customize-cra--before.log", with a prepended message
  // tap({ dest: 'customize-cra--before.log', message: 'Before changes for CKEditor' }),

  // -------------------------------------------------------------------------
  // BEGIN: Webpack modifications for loading CKEditor
  // -------------------------------------------------------------------------
  /* eslint-disable max-len */
  // These are described in detail here:
  // https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html#modifying-webpack-configuration
  // Helpful Medium post:
  // https://medium.com/@adamerose/using-ckeditor-5-in-create-react-app-without-ejecting-cc24ffb3fd9c
  /* eslint-enable max-len */

  // (1) Add new rules
  addWebpackModuleRule({
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
    use: ['raw-loader'],
  }),
  addWebpackModuleRule({
    test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,
    use: [
      {
        loader: 'style-loader',
        // The options are slightly different from what CKE has on their
        // integration guide, b/c we have an older version of style-loader
        // installed for some reason (v0.23.1, instead of v1+).
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
  }),
);
