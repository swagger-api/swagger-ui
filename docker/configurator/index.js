/*
 * Replace static code with configured data based on environment-variables.
 * This code should be called BEFORE the webserver serve the api-documentation.
 */
const fs = require("fs")
const path = require("path")

const translator = require("./translator")
const oauthBlockBuilder = require("./oauth")
const indent = require("./helpers").indent

const START_MARKER = "//<editor-fold desc=\"Changeable Configuration Block\">"
const END_MARKER = "//</editor-fold>"

const targetPath = path.normalize(process.cwd() + "/" + process.argv[2])

const originalHtmlContent = fs.readFileSync(targetPath, "utf8")

const startMarkerIndex = originalHtmlContent.indexOf(START_MARKER)
const endMarkerIndex = originalHtmlContent.indexOf(END_MARKER)

const beforeStartMarkerContent = originalHtmlContent.slice(0, startMarkerIndex)
const afterEndMarkerContent = originalHtmlContent.slice(
  endMarkerIndex + END_MARKER.length
)

if (startMarkerIndex < 0 || endMarkerIndex < 0) {
  console.error("ERROR: Swagger UI was unable to inject Docker configuration data!")
  console.error("!      This can happen when you provide custom HTML/JavaScript to Swagger UI.")
  console.error("!  ")
  console.error(`!      In order to solve this, add the "${START_MARKER}"`)
  console.error(`!      and "${END_MARKER}" markers to your JavaScript.`)
  console.error("!      See the repository for an example:")
  console.error("!      https://github.com/swagger-api/swagger-ui/blob/8c946a02e73ef877d73b7635de27924418ba50f3/dist/swagger-initializer.js#L2-L19")
  console.error("!  ")
  console.error("!      If you're seeing this message and aren't using custom HTML,")
  console.error("!      this message may be a bug. Please file an issue:")
  console.error("!      https://github.com/swagger-api/swagger-ui/issues/new/choose")
  process.exit(0)
}

fs.writeFileSync(
  targetPath,
  `${beforeStartMarkerContent}
      ${START_MARKER}
      window.ui = SwaggerUIBundle({
        ${indent(translator(process.env, {injectBaseConfig: true}), 8, 2)}
      })
      ${indent(oauthBlockBuilder(process.env), 6, 2)}
      ${END_MARKER}
${afterEndMarkerContent}`
)
