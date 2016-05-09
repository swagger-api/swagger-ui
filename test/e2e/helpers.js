'use strict';

var path = require('path');
var SPEC_FILE_EXT = '.json';

module.exports.parseSpecFilename = function (name) {
  var filename = path.parse(name);
  console.log('filename: ' + JSON.stringify(filename));
  var foldername = filename.dir.split(path.sep).splice(-1)[0];
  console.log('foldername: ' + foldername);
  return [path.sep, foldername, path.sep, filename.name, SPEC_FILE_EXT].join('');
};
