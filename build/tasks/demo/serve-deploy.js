var gulp = require('gulp');
var server = require('gulp-express');

/**
 * Serve the deploy directory for deploy testing
 */
gulp.task('demo-serve-deploy',['demo-build-prod'], function() {
  server.run(['server-deploy.js']);
});
