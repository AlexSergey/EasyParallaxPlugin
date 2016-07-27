var jshint = require('gulp-jshint');
var gulp   = require('gulp');
var config = require('./config');
var stylish = require('jshint-stylish');

module.exports = function() {
    gulp.task('jshint', function () {
        return gulp.src(config.src.js)
            .pipe(jshint({
                lookup: true
            }))
            .pipe(jshint.reporter(stylish));
    });
}