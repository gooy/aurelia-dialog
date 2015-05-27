var gulp   = require('gulp');
var fse   = require('fs-extra');
var runSequence = require('run-sequence');

var dirs = gulp.pkg.demo.directories;

/**
 * Copy all files from dist to the deploy directory
 */
gulp.task('demo-deploy-copy', function(done) {
  fse.copy(dirs.build,dirs.deploy,done);
});

/**
 * Build all files for production then copy to the deploy directory
 */
gulp.task('demo-deploy', function(done) {
  return runSequence('demo-build-prod','demo-deploy-copy',done);
});
