var gulp          = require('gulp');
var connect       = require('gulp-connect');
var open          = require('gulp-open');
var log = require('./log');
var argv = require('yargs').argv;
var config = require('./config');


module.exports = function() {
    gulp.task('webserver', function() {
        connect.server({
            root: [config.shareFolder, './'],
            livereload: true,
            port: config.port
        });
    });

    gulp.task('open', function(){
        var options = {
            url: config.host + ':' + config.port + '/',
            app: "chrome"
        };
        gulp.src(config.openHtml)
            .pipe(open("", options));
    });

    gulp.task('server', function(cb) {
        gulp.start('webserver', 'open');
    });
}