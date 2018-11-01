const fs = require("fs")
const path = require("path")

const translator = require("./translator")
const oauthBlockBuilder = require("./oauth")
const indent = require("./helpers").indent

const START_MARKER = "// Begin Swagger UI call region"
const END_MARKER = "// End Swagger UI call region"

const targetPath = path.normalize(process.cwd() + "/" + process.argv[2])

const originalHtmlContent = fs.readFileSync(targetPath, "utf8")

const startMarkerIndex = originalHtmlContent.indexOf(START_MARKER)
const endMarkerIndex = originalHtmlContent.indexOf(END_MARKER)

const beforeStartMarkerContent = originalHtmlContent.slice(0, startMarkerIndex)
const afterEndMarkerContent = originalHtmlContent.slice(endMarkerIndex + END_MARKER.length)

fs.writeFileSync(targetPath, `${beforeStartMarkerContent}
      ${START_MARKER}
      const ui = SwaggerUIBundle({
        ${indent(translator(process.env, { injectBaseConfig: true }), 8, 2)}
      })
      
      ${indent(oauthBlockBuilder(process.env), 6, 2)}
      ${END_MARKER}
${afterEndMarkerContent}`)