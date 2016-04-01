var gulp = require('gulp'),
    concat=require('gulp-concat');

var reqirences = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-materialize/src/angular-materialize.js',
  'bower_components/materialize/bin/materialize.js',
  'bower_components/angular-cookie/angular-cookie.min.js',
];

var css = [
  'bower_components/materialize/bin/materialize.css',
];

gulp.task('default',function(){
  gulp.src(reqirences)
      .pipe(concat('requirences.js'))
      .pipe(gulp.dest('js'));
  gulp.src(css)
      .pipe(concat('dest.css'))
      .pipe(gulp.dest('css'))
});
