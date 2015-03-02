/*
 * Swagger UI and Specs Servers
*/
var path = require('path')
var createServer = require('http-server').createServer;

var dist = path.join(__dirname, '..', '..', 'dist');
var specs = path.join(__dirname, '..', '..', 'test', 'specs');
var DOCS_PORT = 8080;
var SPEC_SERVER_PORT = 8081;

var driver = require('./driver');

var headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
};

var swaggerUI;
var specServer;

module.exports.start = function (specsLocation, done) {
  swaggerUI = createServer({ root: dist, headers: headers });
  specServer = createServer({ root: specs, headers: headers });

  swaggerUI.listen(DOCS_PORT);
  specServer.listen(SPEC_SERVER_PORT);

  var swaggerSpecLocation = encodeURIComponent('http://localhost:' + SPEC_SERVER_PORT + specsLocation)
  var url = 'http://localhost:' + DOCS_PORT + '/index.html?url=' + swaggerSpecLocation;

  setTimeout(function(){
    driver.get(url);
    done();
  }, process.env.TRAVIS ? 6000 : 3000);
};

module.exports.close = function(){
  swaggerUI.close();
  specServer.close();
}