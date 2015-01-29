'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");

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
      './src/main/coffeescript/SwaggerUi'
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
 * Copy lib files
*/
gulp.task('copy', function() {

  return gulp
    .src(['./lib/**/*.js'])
    .pipe(gulp.dest('./dist/lib'));
});


gulp.task('default', ['clean', 'dist', 'copy']);
