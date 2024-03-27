const jsonMerger = require("json-merger")

const result = jsonMerger.mergeFiles(["../../../package.json", "template.json"])

if (process.env.REACT_FLAVOR_VERSION_IDENTIFIER) {
  result.version = process.env.REACT_FLAVOR_VERSION_IDENTIFIER
}

process.stdout.write(JSON.stringify(result, null, 2))
