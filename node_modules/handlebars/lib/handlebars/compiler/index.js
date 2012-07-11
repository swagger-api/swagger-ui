// Each of these module will augment the Handlebars object as it loads. No need to perform addition operations
module.exports = require("./base");
require("./visitor");
require("./printer");

require("./ast");
require("./compiler");
