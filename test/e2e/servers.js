/*
 * Swagger UI and Specs Servers
*/
'use strict';

var path = require('path');
var createServer = require('http-server').createServer;

var dist = path.join(__dirname, '..', '..', 'dist');
var specs = path.join(__dirname, '..', '..', 'test', 'specs');
var DOCS_PORT = 8080;
var SPEC_SERVER_PORT = 8081;

var driver = require('./driver');

var swaggerUI;
var specServer;

module.exports.start = function (specsLocation, done) {
  swaggerUI = createServer({ root: dist, cors: true });
  specServer = createServer({ root: specs, cors: true });

  swaggerUI.listen(DOCS_PORT);
  specServer.listen(SPEC_SERVER_PORT);

  var swaggerSpecLocation = encodeURIComponent('http://localhost:' + SPEC_SERVER_PORT + specsLocation);
  var url = 'http://localhost:' + DOCS_PORT + '/index.html?url=' + swaggerSpecLocation;

  setTimeout(function(){
    driver.get(url);
    setTimeout(function() {
      done();
    }, 2000);
    console.log('waiting for UI to load');
  }, process.env.TRAVIS ? 20000 : 5000);
  console.log('waiting for server to start');
};

module.exports.close = function() {
  swaggerUI.close();
  specServer.close();
};
