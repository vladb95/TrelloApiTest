var gulp = require('gulp'),
    concat=require('gulp-concat');

var reqirences = [
  'bower_components/angular/angular.min.js'
];

gulp.task('default',function(){
  gulp.src(reqirences)
      .pipe(concat('requirences.js'))
      .pipe(gulp.dest('js'));
});
