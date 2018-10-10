const gulp = require('gulp')
const babel = require('gulp-babel')
const browserify = require('browserify')
const uglify = require('gulp-uglify')
const gulpUtil = require('gulp-util')
const sourcemaps = require('gulp-sourcemaps')
const fs = require('fs')
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream')
const watchify = require('watchify')
const browserSync = require('browser-sync').create()
const watch = require('gulp-watch')

gulp.task('watchify', () => {
  var b = watchify(browserify('./src/js/main.js', watchify.args))
    .transform('babelify', {
      presets: ['es2015'],
      ignore: /\/node_modules\/(?!app\/)/
    })

  b.on('update', rebundle)
  b.on('log', gulpUtil.log.bind(gulpUtil))

  function rebundle () {
    return b.bundle()
      .on('error', gulpUtil.log)
      .pipe(source('app.js'))
      .pipe(gulp.dest('./out/src/js'))
      .pipe(browserSync.stream())
  }

  return rebundle()
})

gulp.task('browserify', function () {
  var b = browserify('./src/js/main.js', {
    debug: true
  }).transform('babelify', {
    presets: ['es2015'],
    ignore: /\/node_modules\/(?!app\/)/
  })

  b.on('log', function (msg) {
    console.log(msg)
  })

  return b.bundle()
    .on('error', gulpUtil.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./out/src/js'))
})

// gulp.task("style", function() {
//   gulp.src( "./src/styles/*.styl" )
//     .pipe( plumber() )
//     .pipe( stylus( {
//         use: [ nib() ],
//         url: { name: "url64", paths: [ "./src/styles/" ] }        
//       }))
//       .on( "error", gutil.log )
//       .on( "error", gutil.beep )
//     .pipe( gulp.dest( "./out/src/styles" ) )
//     .pipe( browserSync.stream() );

// });

gulp.task('watch', () => {
  gulp.start('watchify')
})


gulp.task("browsersync", function() {
  browserSync.init({
    server: {
            baseDir: ["./out/src", "./out"]
        }
  });
})

gulp.task('default', ['browserify', 'watch', 'browsersync'])
