var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var angularFilesort = require('gulp-angular-filesort');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var templateCache = require('gulp-angular-templatecache');
// var ngmin = require('gulp-ngmin');
var sh = require('shelljs');
var path = require('path');

var paths = {
  dist: 'www',
  tmp: '.tmp',
  html: './app/templates/*.html',
  json: './app/js/*.json',
  sass: ['./app/css/scss/*.scss', './app/css/scss/**/*.scss', './app/css/scss/**/**/*.scss'],
  css: ['./app/css/*.css'],
  js: ['./app/js/*.js']
};

var $ = require('gulp-load-plugins')({
    pattern: [
        'gulp-*',
        'main-bower-files',
        'uglify-save-license',
        'del'
    ]
});

gulp.task('default', ['clean', 'sass', 'js', 'css', 'html', 'json', 'watch']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('css', function(done) {
    gulp.src(paths.css)
        .pipe(concat('app.css'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(notify({ message: 'css task complete' }))
        .on('end', done);
});

gulp.task('json', function(done) {
    gulp.src(paths.json)
        .pipe(gulp.dest('./www/js/'))
        .pipe(notify({ message: 'json task complete' }))
        .on('end', done);
});

gulp.task('html', function(done) {
    gulp.src(paths.html)
        .pipe(templateCache('templatescache.js', { module:'templatescache', standalone:true, root: 'templates/' }))
        .pipe(gulp.dest('./www/templates/'))
        .pipe(notify({ message: 'templates task complete' }))
        .on('end', done);
});

gulp.task('js', function(done) {
    gulp.src(paths.js)
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(uglify({mangle: false}))
        .pipe(gulp.dest('./www/js/'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .on('end', done);
});

gulp.task('clean', function () {
    return $.del([
        path.join(paths.dist, '/js/'),
        path.join(paths.dist, '/css/'),
        path.join(paths.dist, '/templates/'),
        path.join(paths.tmp, '/')
    ]);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
