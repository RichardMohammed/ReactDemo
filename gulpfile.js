"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // runs a local dev server
var open = require('gulp-open'); // open a url in a web browser
var browserify = require('browserify'); // bundles JS
var reactify = require('reactify'); // Transforms React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with Gulp
var concat = require('gulp-concat'); // concatenate files
var lint = require('gulp-eslint'); // lint js and JSX files

var config = {
  port: 9005,
  devBaseUrl: 'http://localhost',
  paths:{
    html: './src/*.html',
    images: './src/images/*',
    js: './src/**/*.js',
    css: ['node_modules/bootstrap/dist/css/bootstrap.min.css',
          'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
         ],
    dist: './dist',
    mainJs: './src/main.js'
  }
};

gulp.task('connect', function(){
  connect.server({
    root: ['dist'],
    port: config.port,
    base: config.devBaseUrl,
    livereload: true
  });
});

gulp.task('open', ['connect'], function(){
  gulp.src('dist/index.html')
    .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}))
});

gulp.task('html', function(){
  gulp.src(config.paths.html)
  .pipe(gulp.dest(config.paths.dist))
  .pipe(connect.reload());
});

gulp.task('js', function(){
    browserify(config.paths.mainJs)
    .transform(reactify)
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dist + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('css', function(){
  gulp.src(config.paths.css)
      .pipe(concat('bundle.css'))
      .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('images', function(){
  gulp.src(config.paths.images)
      .pipe(gulp.dest(config.paths.dist + '/images'))
      .pipe(connect.reload());
  
  gulp.src('./src/favicon.ico')
      .pipe(gulp.dest(config.paths.dist));
});

gulp.task('lint', function(){
  return gulp.src([config.paths.js,'!node_modules/**'])
            .pipe(lint({config: 'eslint.config.json'}))
            .pipe(lint.format());
});


gulp.task('watch', function(){
  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.js, ['js', 'lint']);
  gulp.watch(config.paths.css, ['css']);
});

gulp.task('default', ['html', 'js', 'lint', 'css', 'images', 'open', 'watch']);
