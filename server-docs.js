var gulp = require('gulp');
gulp.pkg = require("defaults").pkg;
var express = require('express');
var app = module.exports.app = exports.app = express();

var compression = require('compression');
var serveStatic = require('serve-static');

var oneDay = 86400000;
var oneHour = 3600000;

var dirs = gulp.pkg.directories;

app.use(compression());
app.use(serveStatic(dirs.doc_output, {'index': ['index.html'],maxAge:oneHour,setHeaders:function(res, path, stat){
  res.setHeader("Access-Control-Allow-Origin", "*");
}}));

var server = app.listen(9002);

server.on('connection', function(socket) {
  // allow keep-alive of 30 seconds
  // console.log("A new connection was made by a client.");
  socket.setTimeout(30 * 1000);
});
