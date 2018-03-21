// code for "gulp watch"
const pluginName = "au-datetime-picker";

var gulp = require('gulp');
var path = require('path');
var runSequence = require('run-sequence');


// so fusebox uses correct path (needed for gulp)
process.env.PROJECT_ROOT = path.resolve(process.cwd(), './sample/')


// built in plugins to fusebox
const {
    RawPlugin,
    FuseBox,
    HTMLPlugin,
    CSSPlugin,
    CSSResourcePlugin,
    CSSModules,
    Sparky,
    TypeScriptHelpers
} = require("../node_modules/fuse-box");



// typechecker
var TypeHelper = require('../node_modules/fuse-box-typechecker').TypeHelper



// code we want injected so aurelia loads
var injectBoostrapAndLoader = function () {
    var loader = function () { }
    loader.prototype.init = function (context) { }
    loader.prototype.bundleEnd = function (context) {
        context.source.addContent(`FuseBox.import("fuse-box-aurelia-loader")`);
        context.source.addContent(`FuseBox.import("aurelia-bootstrapper")`);
        context.source.addContent(`window.FUSEBOX_AURELIA_LOADER_RELOAD = true;`);
        context.source.addContent(`window.FUSEBOX_AURELIA_LOADER_LOGGING = true;`);
    }
    return new loader();
}



// sample typechecker
gulp.task('sample-typechecker', function () {

    var testWatch = TypeHelper({
        tsConfig: './tsconfig.json',
        name: 'Sample Watch',
        basePath: './sample',
        tsLint: './tslint.json',
        yellowOnLint: true,
        shortenFilenames: true
    })
    testWatch.runWatch('./src')
    return true;
});



// plugin typechecker
gulp.task('plugin-typechecker', function () {

    var testWatch = TypeHelper({
        tsConfig: './tsconfig.json',
        name: 'Plugin Watch',
        tsLint: './tslint.json',
        basePath: './',
        yellowOnLint: true,
        shortenFilenames: true
    })
    testWatch.runWatch('./src')
    return true;
});



// this task will start fusebox (sample)
gulp.task('fuse-sample', function () {

    // typechecker
    const TypeCheckPlugins = require('../node_modules/fuse-box-typechecker').TypeCheckPlugin;

    // init fusebox
    const fuse = FuseBox.init({
        homeDir: './src',
        output: './dist/$name.js',
        log: false, //-> set to true if you want more data
        debug: false, //-> set to true if you want more data
        plugins: [
            injectBoostrapAndLoader(),
            CSSPlugin(),
            CSSResourcePlugin(),
            CSSModules(),
            HTMLPlugin(),
            RawPlugin(['.css', '.woff']),
            TypeScriptHelpers()
        ]
    });


    fuse.register('font-awesome', {
      homeDir: 'node_modules/font-awesome/css',
      main: 'font-awesome.css',
      instructions: 'font-awesome.css',
    });



    // vendor bundle
    fuse.bundle("vendor")
        .cache(true)
        .instructions(`
        + aurelia-bootstrapper
        + aurelia-framework
        + aurelia-pal
        + aurelia-metadata
        + aurelia-loader-default
        + aurelia-polyfills
        + aurelia-fetch-client
        + aurelia-pal-browser
        + aurelia-animator-css
        + aurelia-logging-console
        + aurelia-templating-binding
        + aurelia-templating-resources
        + aurelia-event-aggregator
        + aurelia-history-browser
        + aurelia-templating-router
        + fuse-box-aurelia-loader
        + date-fns
        + bootstrap
        + eonasdan-bootstrap-datetimepicker
        + eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css
        + font-awesome.css
        + font-awesome/css/font-awesome.css
`);


    // app bundle
    fuse.bundle('app')
        .watch().cache(false).hmr()
        .instructions(`
            > [main.ts]
            + [**/*.{ts,html,css}]
        `);

    // web server
    fuse.dev({
        root: './'
    });

    // run
    return fuse.run()
});



// this builds the plugin package
gulp.task('fuse-plugin', function () {

    const fuse = FuseBox.init({
        homeDir: '../src',
        output: './dist/$name.js',
        log: false, //-> set to true if you want more data
        debug: false, //-> set to true if you want more data
        plugins: [
            HTMLPlugin({
                useDefault: true
            }),
            RawPlugin(['.css', '.woff'])
        ],
        package: {
            name: pluginName,
            main: "index.ts"
        },
    });


    fuse.bundle(pluginName)
        .watch().cache(false)
        .instructions(`
            + [**/*.html]
            + [**/*.ts]
            + [**/*.css]
        `).sourceMaps(true);


    return fuse.run();
});




gulp.task('watch', function () {
    return runSequence(
        'fuse-plugin', 'fuse-sample', 'plugin-typechecker', 'sample-typechecker'
    );
});
