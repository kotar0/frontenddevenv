var gulp = require('gulp');
var watch = require('gulp-watch');
var sync = require('browser-sync');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var sourcemaps = require('gulp-sourcemaps');
var processors = [cssnext()]; //cssnextのオプション等指定。
var plumber = require('gulp-plumber');//処理を止めないように



gulp.task('sass', function () {
  return gulp.src('dev/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      sourcemap: true
    }))
    .pipe(plumber())
    .on('error', function (err) {
      console.log(err.message);
    })
    .pipe(postcss(processors)) //prefixなどを追加
    .pipe(sourcemaps.write('maps/'))
    .pipe(gulp.dest('docs/css/'))
    .pipe(sync.stream()) //これを足すとライブリロードに対応。
})


//publish サーバーアップ用(ソースマップや必要なJSのみにしている)
gulp.task('publish', function () {
  gulp.src('dev/sass/*.scss')
    .pipe(sass())
    .on('error', function (err) {
      console.log(err.message);
    })
    .pipe(postcss(processors)) //prefixなどを追加
    .pipe(gulp.dest('publish/css/'))
})

//Browsersync
gulp.task('server', function () {
  sync.init({
    server: {
      baseDir: './docs'
    }
  });
})

gulp.task('reload', function(){
  sync.reload();
})

//Watchタスクを別のタスクと分けて書いている
//Write dowm watch task apart from others.
gulp.task('watch', function () {
  gulp.watch('dev/sass/*.scss', ['sass']);
  gulp.watch('docs/**', ['reload']);
})

gulp.task('default', ['server', 'watch'], function () {

})



/*
dev以下と、src/image以下の中が更新されたら、自動リロード


*/