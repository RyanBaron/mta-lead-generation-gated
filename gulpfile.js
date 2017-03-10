var gulp          = require('gulp');
var uglify        = require('gulp-uglify');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var sourcemaps    = require('gulp-sourcemaps');
var cssNano       = require('gulp-cssnano');
var jshint        = require('gulp-jshint');
var concat        = require('gulp-concat');
var browserslist  = require('browserslist');
var del           = require('del');
var runSequence   = require('run-sequence');
//var scsslint      = require('gulp-scss-lint');
//var scssLint        = require('gulp-scss-lint');
//var scssLintStylish = require('gulp-scss-lint-stylish');


/*
* ToDo: add linting for scss/css.
* ToDo: look at linting order
*/

// ### Clean
// `gulp clean` - Deletes the build folder entirely.
gulp.task('clean', function(){
  del([
    './public/css/**',
    './public/js/**/*',
    './admin/css/**/*',
    './admin/js/**/*'
  ],{dryRun: false}).then(paths => {
    //console.log('Deleted files and folders:\n',paths.join('\n'));
  });
});

//adminStyles task
gulp.task('adminStyles', function () {
  gulp.src('./admin/src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer(browserslist('last 2 version, > 0.25%')))
    .pipe(cssNano({zindex: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./admin/css'));
});

//publicStyles task
gulp.task('publicStyles', function () {
  gulp.src('./public/src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()
      .on('error', sass.logError))
    .pipe(concat('styles.min.css'))
    .pipe(autoprefixer(browserslist('last 2 version, > 0.25%')))
    .pipe(cssNano({zindex: false}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));
});

//adminScripts task
gulp.task('adminScripts', function() {
  gulp.src('./admin/src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./admin/js'))
});

//publicScripts task
gulp.task('publicScripts', function() {
  gulp.src('./public/src/js/**/*.js')
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./public/js'))
});

// jsLint task
gulp.task('jsLint', function () {
  gulp.src([
    './admin/src/js/**/*.js',
    './public/src/js/**/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish')); // Dump results
});

//gulp.task('scss-lint', function() {
//  gulp.src([
//    './public/src/sass/**/*.scss'
//  ])
//    .pipe( scssLint() );
//});

// ### Gulp
// 'gulp' - Run a complete build.
gulp.task('default', function() {
  gulp.start('build');
});

// ### Build
// 'gulp build'
gulp.task('build', function(callback) {
  runSequence('clean',
              'adminStyles',
              'publicStyles',
              'jsLint',
              'adminScripts',
              'publicScripts',
              callback);
});
