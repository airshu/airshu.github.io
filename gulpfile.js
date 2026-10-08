const gulp = require('gulp');
const path = require('path');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const htmlmin = require('gulp-htmlmin');
const htmlclean = require('gulp-htmlclean');
const imagemin = require('gulp-imagemin');

// 压缩 public 目录 css
function cleanCss() {
    return gulp.src('./public/**/*.css')
        .pipe(cleanCSS({
            rebase: false
        }))
        .pipe(gulp.dest('./public'));
}
// 压缩 public 目录 html
function minifyHtml() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
             removeComments: true,
             minifyJS: true,
             minifyCSS: true,
             minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'))
}
// 压缩 public 目录 js
function minifyJs() {
    return gulp.src('./public/**/*.js')
        .pipe(terser())
        .pipe(gulp.dest('./public'));
}
// 压缩图片任务
function compressImgsFolder(imgFolder='.') {
    return function () {
        return gulp.src(path.join(imgFolder, '/**/*.{png,jpg,gif,svg}'))
            // imagemin Usage at https://github.com/sindresorhus/gulp-imagemin#user-content-options
            .pipe(imagemin([
                    imagemin.gifsicle({interlaced: true}),  // gif 转为交错格式
                    imagemin.mozjpeg({progressive: true}), // jpeg 转为渐进式
                    imagemin.optipng({optimizationLevel: 4}),
                    imagemin.svgo({floatPrecision: 1}) // https://github.com/svg/svgo/issues/171
                ], {verbose: false}
            ))
            .pipe(gulp.dest(imgFolder))
    }
}
const minifyImgs = compressImgsFolder('./public/images/');
const minifyPostImgs = compressImgsFolder('./public/wiki/');
// 执行 gulp 命令时执行的任务
gulp.task('default', gulp.parallel(
    minifyHtml, cleanCss, minifyJs,
    minifyImgs, minifyPostImgs
));
