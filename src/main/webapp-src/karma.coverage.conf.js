// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    preprocessors: {
        '../webapp/js/all.js': 'coverage',
        'app/js/**/*.test.js': 'babel',
        'app/js/**/*.html': 'ng-html2js'
    },

    // list of files / patterns to load in the browser
    files: [
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'node_modules/angular-mocks/angular-mocks.js',
        '../webapp/js/all.js',
        'app/js/**/*.html',
        'app/js/**/*.test.js'
    ],

    ngHtml2JsPreprocessor: {
        moduleName: 'templates',
        stripPrefix: 'app/'
    },
    babelPreprocessor: {
        options: {
            presets: ['es2015'],
            sourceMap: 'inline'
        },
        filename: function (file) {
            return file.originalPath.replace(/\.js$/, '.es5.js');
        },
        sourceFileName: function (file) {
            return file.originalPath;
        }
    },

    plugins: [
       require('./node_modules/karma-jasmine'),
       require('./node_modules/karma-coverage'),
       require('./node_modules/karma-phantomjs-launcher'),
       require('./node_modules/karma-ng-html2js-preprocessor'),
       require('./node_modules/karma-babel-preprocessor')
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    reporters: ['progress', 'coverage'],

    colors: true,

    coverageReporter: {
        type : 'html',
        dir: 'reports',
        subdir: 'coverage'
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
