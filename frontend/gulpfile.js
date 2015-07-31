var gulp = require('gulp');
var connect = require('gulp-connect');
var rename = require("gulp-rename");
var del = require('del');
var shell = require('gulp-shell');

gulp.task('serve', function () {
    require('../backend/server');
    connect.server({
        livereload: true,
        port: 8000,
        root: ['../build'],
        middleware: function(connect,o){
            return [
                (function() {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse('http://localhost:8080');
                    options.route = '/';
                    return proxy(options);
                })()
            ]
        }
    });
});

gulp.task('build', function () {
    del(['./../build/**/*'], {force: true});

    gulp.src('./index_prod.html')
        .pipe(rename("index.html"))
        .pipe(shell(['jspm bundle-sfx src/main ../build/app.js']))
        .pipe(gulp.dest('./../build'));

    gulp.src('./css/**')
        .pipe(gulp.dest('./../build/css'));
});

gulp.task('serve-build', ['build'], function () {
    connect.server({
        root: '../build',
        port: 8001
    });
});