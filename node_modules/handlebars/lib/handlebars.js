var Handlebars = require("./handlebars/base");
module.exports = Handlebars;

// Each of these augment the Handlebars object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
require("./handlebars/utils");

require("./handlebars/compiler");
require("./handlebars/runtime");

// BEGIN(BROWSER)

// END(BROWSER)

