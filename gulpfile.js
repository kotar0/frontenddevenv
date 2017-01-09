var gulp = require('gulp');
var watch = require('gulp-watch');
var sync = require('browser-sync');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var sourcemaps = require('gulp-sourcemaps');
var processors = [cssnext()]; //cssnextのオプション等指定。
var plumber = require('gulp-plumber'); //処理を止めないように
var csscomb = require('gulp-csscomb');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var webpack = require('gulp-webpack')
,plumber = require('gulp-plumber'),//処理を止めないように
,imagemin   = require("gulp-imagemin")//画像圧縮用
,jpegtran = require('imagemin-jpegtran')//圧縮処理JPG
,optipng = require('imagemin-optipng')//圧縮処理PNG
,pngquant   = require("imagemin-pngquant");


gulp.task('ts', function () {
  //出力オプション
  var options = {
    out: 'main.js',
    target: 'ES2015',
    removeComments: true
  };
  gulp.src([
      'dev/js/*.ts',
      '!./node_modules/**' //node_modules配下は除外する
    ])
    .pipe(ts(options))
    .pipe(gulp.dest('./docs/js'));
});

gulp.task('babel',function(){
    gulp.src('dev/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('docs/js'))
});

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
    .pipe(csscomb()) //tidy css
    .pipe(postcss(processors)) //prefixなどを追加
    .pipe(sourcemaps.write('maps/'))
    .pipe(gulp.dest('docs/css/'))
    .pipe(sync.stream()) //これを足すとライブリロードに対応。
})

//Sassの整理用
gulp.task('tidysass', function () {
  return gulp.src('dev/sass/*.scss')
    .pipe(csscomb())
    .pipe(gulp.dest('dev/sass/'));
});

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

gulp.task('reload', function () {
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