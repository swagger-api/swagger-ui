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
const afterEndMarkerContent = originalHtmlContent.slice(
  endMarkerIndex + END_MARKER.length
)

if (startMarkerIndex < 0 || endMarkerIndex < 0) {
  console.error("ERROR: Swagger UI was unable to inject Docker configuration data!")
  console.error("!      This can happen when you provide custom HTML to Swagger UI.")
  console.error("!  ")
  console.error("!      In order to solve this, add the `Begin Swagger UI call region`")
  console.error("!      and `End Swagger UI call region` markers to your HTML.")
  console.error("!      See the repository for an example:")
  console.error("!      https://github.com/swagger-api/swagger-ui/blob/02758b8125dbf38763cfd5d4f91c7c803e9bd0ad/dist/index.html#L40-L54")
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
      const ui = SwaggerUIBundle({
        ${indent(translator(process.env, { injectBaseConfig: true }), 8, 2)}
      })
      
      ${indent(oauthBlockBuilder(process.env), 6, 2)}
      ${END_MARKER}
${afterEndMarkerContent}`
)
