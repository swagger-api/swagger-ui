'use strict';

module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'sinon-chai' ],

    files: [
      'dist/lib/jquery-1.8.0.min.js',
      'dist/lib/jquery.slideto.min.js',
      'dist/lib/jquery.wiggle.min.js',
      'dist/lib/jquery.ba-bbq.min.js',
      'dist/lib/handlebars-2.0.0.js',
      'dist/lib/js-yaml.min.js',
      'dist/lib/lodash.min.js',
      'dist/lib/backbone-min.js',
      'dist/swagger-ui.js',
      'dist/lib/highlight.7.3.pack.js',
      'dist/lib/jsoneditor.min.js',
      'dist/lib/marked.js',
      'dist/lib/swagger-oauth.js',
      'test/unit/mock.js',
      'test/unit/**/*.js'
    ],

    //singleRun: true,

    browsers: [ 'PhantomJS'/*,  'Chrome' */]
  });
};
