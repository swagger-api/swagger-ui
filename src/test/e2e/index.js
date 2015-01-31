var webdriver = require('selenium-webdriver');
var createServer = require('http-server').createServer;
var expect = require('chai').expect;
var path = require('path')

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


/*
 * Checks console errors and fails if there is any error
 * Note: It's a good idea to run this after each operation
*/
function checkConsoleErrors () {
  it('should not have any console errors', function (done) {
    driver.manage().logs().get('browser').then(function(browserLogs) {
      var errors = [];

      browserLogs.forEach(function(log){

        // 900 and above is "error" level. Console should not have any errors
        if (log.level.value > 900) {
          console.log('browser error message:', log.message);
          errors.push(log);
        }
      });

      expect(errors).to.be.empty;

      done();
    });
  });
}

describe('basics', function (done) {
  this.timeout(10 * 1000);

  beforeEach(function () {
    driver.get('http://localhost:' + PORT + '/index.html');
  });

  it('should have "Swagger UI" in title', function (done) {
    driver.sleep(200);
    driver.getTitle().then(function(title) {
      expect(title).to.contain('Swagger UI');
      done();
    });
  });

  checkConsoleErrors();
});

describe('cleanup', function  () {
  it('kills the static server', function () {
    server.close();
  });

  it('quit the webdriver', function () {
    driver.quit();
  });
})