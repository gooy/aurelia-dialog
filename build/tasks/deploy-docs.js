var gulp   = require('gulp');
var ghPages = require('gulp-gh-pages');
var runSequence = require('run-sequence');
var fse   = require('fs-extra');
var dirs = gulp.pkg.directories;

// then runs deploy-gh-pages which publishes the dist folder to gh-pages branch
gulp.task('deploy-docs-copy', function(done) {
  fse.copy(dirs.doc_output,dirs.doc_deploy,done);
});

gulp.task('deploy-docs', function(done) {
  return runSequence('docs','deploy-docs-copy',done);
});
