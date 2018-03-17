import {CLIOptions} from 'aurelia-cli';
import {Server as Karma} from 'karma';
import * as path from 'path';

const karma = (done) => {
  new Karma({
    configFile: path.join(__dirname, '/../../test/karma.conf.js'),
    singleRun: !CLIOptions.hasFlag('watch'),
    autoWatch: CLIOptions.hasFlag('watch')
  }, (exitCode) => {
    console.log('Karma has exited with ' + exitCode);
    process.exit(exitCode);
  }).start();
};

export { karma as default };
