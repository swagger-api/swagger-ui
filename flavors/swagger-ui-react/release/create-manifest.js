var jsonMerger = require("json-merger")
var fs = require("fs")
var result = jsonMerger.mergeFiles(["../../../package.json", "template.json"])

process.stdout.write(JSON.stringify(result, null, 2))