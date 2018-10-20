const fs = require("fs")
const path = require("path")

const INVOCATION_REGEX = /SwaggerUIBundle\(\{[\S\s]+}\)/gm

const INJECTOR_STRING = "***Configurator injection point***"

const TARGET_PATH = process.argv[2]

const originalHtmlContent = fs.readFileSync(path.normalize(process.cwd() + "/" + TARGET_PATH), "utf8")

const matches = originalHtmlContent.match(INVOCATION_REGEX)

console.log(originalHtmlContent.replace(matches[0], INJECTOR_STRING))

const swaggerUiConfiguration = {}

