/**
 * Config based on https://github.com/aurelia/skeleton-navigation/blob/master/skeleton-typescript-webpack/webpack.config.js
 *
 * Notable:
 * https://github.com/jods4/aurelia-webpack-build/blob/master/demos/01-No_splits/webpack.config.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin, ContextReplacementPlugin,  IgnorePlugin,
  SourceMapDevToolPlugin, NormalModuleReplacementPlugin, DefinePlugin } = require('webpack');
// const { TsConfigPathsPlugin, CheckerPlugin } = require('awesome-typescript-loader');
// const { } = require('ts-loader');
const project = require('./aurelia_project/aurelia.json');
const projectJSON = require('./package.json');

const tsLoader = 'ts-loader';

// config helpers:
const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

// primary config:
const title = 'au-datetime-picker Aurelia DateTime Picker';
const outDir = path.resolve(__dirname, project.dist.output);
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
  { loader: 'css-loader' },
];

module.exports = ({production, server, extractCss, coverage} = {}) => ({
  mode: production ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [srcDir, 'node_modules']
  },
  entry: {
    app: [  './src/main.ts', 'aurelia-bootstrapper' ],
  },
  output: {
    path: outDir,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
  },
  devServer: {
    contentBase: outDir,
    // serve index.html for all 404 (required for push-state)
    historyApiFallback: true
  },
  // devtool: production ? 'none' : 'cheap-module-eval-source-map', // 'nosources-source-map'
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssRules
        }) : ['style-loader', ...cssRules],
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: cssRules
      },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts$/i, loader: tsLoader, exclude: nodeModulesDir },
      { test: /\.json$/i, loader: 'json-loader' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?.*$|$)/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?.*$|$)/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf|woff2?)(\?.*$|$)/i, loader: 'file-loader', options: {
        name: '[name].[ext]',
        outputPath: 'fonts/'
      } },
      ...when(coverage, {
        test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
        include: srcDir, exclude: [/\.{spec,test}\.[jt]s$/i],
        enforce: 'post', options: { esModules: true },
      })
    ]
  },
  plugins: [
    new CleanWebpackPlugin([outDir]),
    new AureliaPlugin({
      customViewLoaders: {
        '.css': ['css-loader'],
      },
      root: path.resolve(),
      src: srcDir,
      includeAll: false
    }),
    new ProvidePlugin({
      $: 'jquery',      // because 'bootstrap' by Twitter depends on this
      jQuery: 'jquery', // just an alias
    }),
    new ModuleDependenciesPlugin({
      'aurelia-testing': [ './compile-spy', './view-spy' ],
    }),
    // new TsConfigPathsPlugin(),
    // new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      minify: production ? {
        removeComments: true,
        collapseWhitespace: true
      } : undefined,
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      }
    }),
    ...when(extractCss, new ExtractTextPlugin({
      filename: `css/${production ? '[contenthash].css' : '[id].css'}`,
      allChunks: true
    }))
  ]
});
