var webdriver = require('selenium-webdriver');
var createServer = require('http-server').createServer;
var expect = require('chai').expect;
var path = require('path')

var dist = path.join(__dirname, '..', '..', 'dist');
var specs = path.join(__dirname, '..', '..', 'test', 'specs');
var DOCS_PORT = 8080;
var SPEC_SERVER_PORT = 8081

var headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
};

var elements = [
  'swagger-ui-container',
  'resources_container',
  'api_info',
  'resource_pet',
  'resource_store',
  'resource_user',
  'header'
];

describe('swagger 2.0 spec tests', function (done) {
  this.timeout(10 * 1000);
  var swaggerUI, specServer, driver;

  before(function () {
    swaggerUI = createServer({ root: dist, headers: headers });
    specServer = createServer({ root: specs, headers: headers });
    driver = new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.firefox()).build();

    swaggerUI.listen(DOCS_PORT);
    specServer.listen(SPEC_SERVER_PORT);

    var swaggerSpecLocation = encodeURIComponent('http://localhost:' + SPEC_SERVER_PORT + '/v2/petstore.json')
    driver.get('http://localhost:' + DOCS_PORT + '/index.html?url=' + swaggerSpecLocation);
  });

  afterEach(function(){
    it('should not have any console errors', function (done) {
      driver.manage().logs().get('browser').then(function(browserLogs) {
        var errors = [];
        browserLogs.forEach(function(log){
          // 900 and above is "error" level. Console should not have any errors
          if (log.level.value > 900)
            console.log('browser error message:', log.message); errors.push(log);
        });
        expect(errors).to.be.empty;
        done();
      });
    });
  });

  it('should have "Swagger UI" in title', function (done) {
    driver.sleep(200);
    driver.getTitle().then(function(title) {
      expect(title).to.contain('Swagger UI');
      done();
    });
  });

  elements.forEach(function (id) {
    it('should render element: ' + id, function (done) {
      var locator = webdriver.By.id(id);
      driver.isElementPresent(locator).then(function (isPresent) {
        expect(isPresent).to.be.true;
        done();
      });
    });
  });

  it('should find the contact name element', function(done){
    var locator = webdriver.By.css('.info_name');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the contact email element', function(done){
    var locator = webdriver.By.css('.info_email');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the contact url element', function(done){
    var locator = webdriver.By.css('.info_url');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the pet link', function(done){
    var locator = webdriver.By.xpath("//*[@data-id='pet']");
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the pet resource description', function(done){
    var locator = webdriver.By.xpath("//div[contains(., 'Everything about your Pets')]");
    driver.findElements(locator).then(function (elements) {
      expect(elements.length).to.not.equal(0);
      done();
    });
  });

  it('should find the user link', function(done){
    var locator = webdriver.By.xpath("//*[@data-id='user']");
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the store link', function(done){
    var locator = webdriver.By.xpath("//*[@data-id='store']");
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  after(function() {
    swaggerUI.close();
    specServer.close();
    driver.quit();
  });
});