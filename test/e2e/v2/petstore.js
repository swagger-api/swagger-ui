'use strict';

var expect = require('chai').expect;
var webdriver = require('selenium-webdriver');
var driver = require('../driver');
var servers = require('../servers');
var until = webdriver.until;
var helpers = require('../helpers');

var elements = [
  'swagger-ui-container',
  'resources_container',
  'api_info',
  'resource_pet',
  'resource_store',
  'resource_user',
  'header'
];

var specPath = helpers.parseSpecFilename(__filename);

describe('swagger 2.0 spec tests', function () {
  this.timeout(40 * 1000);

  before(function (done) {
    this.timeout(50 * 1000);
    servers.start(specPath, done);
  });

  afterEach(function(){
    it('should not have any console errors', function (done) {
      driver.manage().logs().get('browser').then(function(browserLogs) {
        var errors = [];
        browserLogs.forEach(function(log){
          // 900 and above is "error" level. Console should not have any errors
          if (log.level.value > 900) {
            console.log('browser error message:', log.message); errors.push(log);
          }
        });
        expect(errors).to.be.empty;
        done();
      });
    });
  });

  it('should have "Swagger UI" in title', function () {
    return driver.wait(until.titleIs('Swagger UI'), 1000);
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
    var locator = webdriver.By.xpath('//*[@data-id="pet"]');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the pet resource description', function(done){
    var locator = webdriver.By.xpath('//div[contains(., "Everything about your Pets")]');
    driver.findElements(locator).then(function (elements) {
      expect(elements.length).to.not.equal(0);
      done();
    });
  });

  it('should find the user link', function(done){
    var locator = webdriver.By.xpath('//*[@data-id="user"]');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });

  it('should find the store link', function(done){
    var locator = webdriver.By.xpath('//*[@data-id="store"]');
    driver.isElementPresent(locator).then(function (isPresent) {
      expect(isPresent).to.be.true;
      done();
    });
  });
/*
  // TODO: disabling for now
  ['root.id','root.username','root.firstName','root.lastName', 'root.email', 'root.password', 'root.phone', 'root.userStatus']
  .forEach(function (id) {
    it('should find a jsoneditor for user post with field: ' + id, function (done) {
      var locator = webdriver.By.xpath('//*[@id=\'user_createUser\']//*[@data-schemapath=\''+id+'\']');
      driver
        .wait(webdriver.until.elementLocated(locator),2000)
        .then(function() { done(); });
    });
  });

  // TODO JSonEditor Tests for POST/PUT
*/
  after(function(done) {
    servers.close();
    done();
  });
});
