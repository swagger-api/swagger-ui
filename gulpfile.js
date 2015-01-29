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

/*
 * Clean ups ./dist folder
*/
gulp.task('clean', function() {

  return gulp
    .src('./dist/**/*', {read: false})
    .pipe(clean({force: true}))
    .on('error', gutil.log);
});

/*
 * Processes Handlebars templates
*/
function templates() {
  return gulp
    .src(['./src/main/template/**/*'])
    .pipe(handlebars())
    .pipe(wrap('Handlebars.template(/*__DEFINING__*/<%= contents %>)'))
    .pipe(declare({
      namespace: 'Handlebars.templates',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .on('error', gutil.log);
}

/*
 * Processes CoffeeScript files
*/
function coffeescript () {
  return gulp
    .src(['./src/main/coffeescript/**/*.coffee'])
    .pipe(coffee({bare: true}))
    .on('error', gutil.log);
}

/*
 * Build a distribution
*/
gulp.task('dist', function() {

  return es.merge(coffeescript(), templates())
    .pipe(concat('swagger-ui.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist'));
});

/*
 * Processes less files into CSS files
*/
gulp.task('less', function() {

  return gulp
    .src([
      './src/main/less/screen.less',
      './src/main/less/reset.less'
    ])
    .pipe(less())
    .on('error', gutil.log)
    .pipe(gulp.dest('./src/main/html/css/'));
});


/*
 * Copy lib and html folders
*/
gulp.task('copy', function() {

  // copy JavaScript files inside lib folder
  gulp
    .src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/lib'))
    .on('error', gutil.log);

  // copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'))
    .on('error', gutil.log);
});


gulp.task('default', ['clean', 'dist', 'copy']);
