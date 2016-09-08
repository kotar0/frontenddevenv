var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sync = require('browser-sync'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    cssnext = require('postcss-cssnext'),
    sourcemaps = require('gulp-sourcemaps'),
    processors = [cssnext()], //cssnextのオプション等指定。
    plumber = require('gulp-plumber'),//処理を止めないように
    imagemin   = require("gulp-imagemin"),//画像圧縮用
    jpegtran = require('imagemin-jpegtran'),//圧縮処理JPG
    optipng = require('imagemin-optipng'),//圧縮処理PNG
    pngquant   = require("imagemin-pngquant");


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

//圧縮処理をする
gulp.task("imgmin", function() {
  gulp.src('original_images/*.png')
      .pipe(imagemin({
        progressive       : true,
        use               : [pngquant()],
        optimizationLevel : 7
      }))
      .pipe(gulp.dest('optimized_images'));
});

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