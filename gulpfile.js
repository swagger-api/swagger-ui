'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var less = require('gulp-less');

/*
 * Clean ups ./dist folder
*/
gulp.task('clean', function() {

  return gulp
    .src('./dist', {read: false})
    .pipe(clean({force: true}));
});

/*
 * Build a distribution
*/
gulp.task('dist', function() {

  return gulp
    .src([
      './src/main/coffeescript/view/**/*.coffee',
      './src/main/coffeescript/SwaggerUi.coffee'
    ])
    .pipe(coffee({bare: true}))
    .pipe(concat('swagger-ui.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist'))
    .on('error', gutil.log);
});

/*
 * Processes less files into CSS files
*/
gulp.task('less', function() {

  gulp
    .src('./src/main/less/screen.less')
    .pipe(less())
    .pipe(gulp.dest('./src/main/html/css/screen.css'));

  gulp
    .src('./src/main/less/reset.less')
    .pipe(less())
    .pipe(gulp.dest('./src/main/html/css/reset.css'));
});

/*
 * Copy lib and html folders
*/
gulp.task('copy', function() {

  // copy JavaScript files inside lib folder
  gulp
    .src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/lib'));

  // copy all files inside html folder
  gulp
    .src(['./src/main/html/**/*'])
    .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['clean', 'dist', 'copy']);
