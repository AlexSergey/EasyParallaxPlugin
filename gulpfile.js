var gulp = require('gulp');
var colors = require('colors');

require('./tasks/js')();
require('./tasks/server')();

require('./tasks/documentation')();

require('./tasks/lint')();

gulp.task('b', [
    'js'
]);

gulp.task('w', [
    'server',
    'jsWatch'
]);
