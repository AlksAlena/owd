
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  cssnano = require('gulp-cssnano'),
  rename = require('gulp-rename'),
  ext_replace = require('gulp-ext-replace'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer');

gulp.task('css', function() {
  return gulp.src('src/css/**/*.css')
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('css-min', ['css'],  function() {
  return gulp.src([
    'src/css/main.css',
    'src/css/media.css'
    ])
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('src/css'));
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('public/img'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    },
    notify: false
  });
});

gulp.task('cleanpublic', function() {
  return del.sync('public');
});

gulp.task('watch', ['browser-sync', 'css-min'], function() {
  gulp.watch('src/css/**/*.css', ['css']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['cleanpublic', 'img', 'css-min'], function() {
  var buildCss = gulp.src([
    'src/css/media.min.css',
    'src/css/main.min.css'
    ])
    .pipe(ext_replace('.css', '.min.css'))
    .pipe(gulp.dest('public/css'));

  var buildFonts = gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('public/fonts'));

  var buildJs = gulp.src('src/js/**/*')
    .pipe(gulp.dest('public/js'));

  var buildJsLibs = gulp.src('src/libs/**/*')
    .pipe(gulp.dest('public/libs'));

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('public'));
});

gulp.task('cleanCache', function () {
  return cache.clearAll();
});

gulp.task('default', ['watch']);

