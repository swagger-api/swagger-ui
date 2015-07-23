/*
 * Web driver manager
*/
'use strict';

var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();

module.exports = driver;