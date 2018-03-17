import {reportWebpackReadiness, CLIOptions} from 'aurelia-cli';
import * as gulp from 'gulp';
import * as webpack from 'webpack';
import * as Server from 'webpack-dev-server';

import * as project from '../aurelia.json';

import {config} from './build';
import {buildWebpack} from './build';
import configureEnvironment from './environment';

function runWebpack(done) {
  // https://webpack.github.io/docs/webpack-dev-server.html
  const opts = {
    host: project.platform.host,
    publicPath: config.output.publicPath,
    filename: config.output.filename,
    hot: project.platform.hmr || CLIOptions.hasFlag('hmr'),
    port: project.platform.port,
    contentBase: config.output.path,
    historyApiFallback: true,
    open: project.platform.open,
    stats: {
      colors: require('supports-color')
    }
  } as any;

  if (!CLIOptions.hasFlag('watch')) {
    opts.lazy = true;
  }

  if (project.platform.hmr || CLIOptions.hasFlag('hmr')) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.app.unshift(`webpack-dev-server/client?http://${opts.host}:${opts.port}/`, 'webpack/hot/dev-server');
  }

  const compiler = webpack(config as any);
  const server = new Server(compiler, opts);

  server.listen(opts.port, opts.host, (err) => {
    if (err) {
      throw err;
    }

    if (opts.lazy) {
      buildWebpack(() => {
        reportWebpackReadiness(opts);
        done();
      });
    } else {
      reportWebpackReadiness(opts);
      done();
    }
  });
}

const run = gulp.series(
  configureEnvironment,
  runWebpack
);

export { run as default };
