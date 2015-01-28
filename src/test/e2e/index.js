var webdriver = require('selenium-webdriver');
var createServer = require('http-server').createServer;
var path = require('path');
var dist = path.join(__dirname, '..', '..', '..', 'dist');
var PORT = 8080;

console.log('started static server from', dist, 'at port', PORT);

var server = createServer({
  root: dist,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  }
});

server.listen(PORT);

var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.firefox()).
   build();


describe('basics', function () {

  this.timeout(10 * 1000);

  beforeEach(function () {
    driver.get('http://localhost:' + PORT);
  });

  it('should have "Swagger UI" in title', function (done) {

    driver.wait(function() {
      return driver.getTitle().then(function(title) {
        var hasTitle = title.indexOf('Swagger UI') > -1;

        if (hasTitle) { done(); }

        return hasTitle;
      });
    }, 1000);
  });
});

describe('cleanup', function  () {

  it('kills the static server', function () {
    server.close();
  });

  it('quit the webdriver', function () {
    driver.quit();
  });
})



