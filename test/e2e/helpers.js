'use strict';

var path = require('path');
var SPEC_FILE_EXT = '.json';

module.exports.parseSpecFilename = function (name) {
  var filename = path.parse(name);
  var foldername = filename.dir.split(path.sep).splice(-1)[0];
  return [path.sep, foldername, path.sep, filename.name, SPEC_FILE_EXT].join('');
};
