'use strict';

var gulp = require('gulp');
var es = require('event-stream');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var header = require('gulp-header');
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

/**
 * Clean ups ./dist folder
 */
gulp.task('clean', function() {
  return gulp
    .src('./dist', {read: false})
    .pipe(clean({force: true}))
    .on('error', gutil.log);
});

/**
 * Processes Handlebars templates
 */
function templates() {
  return gulp
    .src(['./src/main/template/**/*'])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'Handlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .on('error', gutil.log);
}

/**
 * Processes CoffeeScript files
 */
function coffeescript () {
  return gulp
    .src(['./src/main/coffeescript/**/*.coffee'])
    .pipe(coffee({bare: true}))
    .on('error', gutil.log);
}

/**
 * Build a distribution
 */
gulp.task('dist', ['clean'], function() {

  return es.merge(
      gulp.src('./src/main/javascript/doc.js'),
      coffeescript(),
      templates()
    )
    .pipe(concat('swagger-ui.js'))
    .pipe(header(banner, { pkg: pkg } ))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

/**
 * Processes less files into CSS files
 */
gulp.task('less', ['clean'], function() {

  return gulp
    .src([
      './src/main/less/screen.less',
      './src/main/less/reset.less'
    ])
    .pipe(less())
    .on('error', gutil.log)
    .pipe(gulp.dest('./src/main/html/css/'))
    .pipe(connect.reload());
});


/**
 * Copy lib and html folders
 */
gulp.task('copy', ['less'], function() {

  // copy JavaScript files inside lib folder
  gulp
    .src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/lib'))
    .on('error', gutil.log)

  // copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'))
    .on('error', gutil.log)
});

/**
 * Watch for changes and recompile
 */
gulp.task('watch', function() {
  return watch(['./src/**/*.{coffee,js,less}'], function() {
    gulp.start('default');
  });
});

/**
 * Live reload web server of `dist`
 */
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});


gulp.task('default', ['dist', 'copy']);
gulp.task('serve', ['connect', 'watch'])
