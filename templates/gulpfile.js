"use strict";

var gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  sass = require('gulp-sass'),
  inject = require('gulp-inject'),
  maps = require('gulp-sourcemaps'),
  wiredep = require('wiredep').stream,
  config = {
    sassPath: 'assets/styles/scss/',
    bowerDir: ''
  };

/*-------------------
  Reload Browser
---------------------*/
//build sass, then reload the page
gulp.task('reload', ['buildSass'], function (done) {
  gulp.start('buildSass');
  browserSync.reload();
  done();
});

/*-------------------
process sass
---------------------*/
gulp.task('buildSass', function () {
  var injectFiles = {
    components: gulp.src(config.sassPath + 'components/*.scss', {
      read: false
    }),
    layout: gulp.src(config.sassPath + 'layout/*.scss', {
      read: false
    }),
    pages: gulp.src(config.sassPath + 'pages/*.scss', {
      read: false
    })
  };

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectOptions = {
    components: {
      transform: transformFilepath,
      starttag: '// inject:components',
      endtag: '// endinject',
      addRootSlash: false
    },
    layout: {
      transform: transformFilepath,
      starttag: '// inject:layout',
      endtag: '// endinject',
      addRootSlash: false
    },
    pages: {
      transform: transformFilepath,
      starttag: '// inject:pages',
      endtag: '// endinject',
      addRootSlash: false
    }
  };

  return gulp.src('assets/styles/scss/application.scss')
    .pipe(wiredep())
    .pipe(inject(injectFiles.components, injectOptions.components))
    .pipe(inject(injectFiles.pages, injectOptions.pages))
    .pipe(inject(injectFiles.layout, injectOptions.layout))
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/styles/css'));
});

/*-------------------
Browser sync watch files and server start
---------------------*/
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('*.html', ['reload']);
  gulp.watch('assets/styles/scss/*/*.scss', ['reload']);
  gulp.watch('assets/js/*.js', ['reload']);
});


gulp.task('default', function () {
  gulp.start('browser-sync');
});