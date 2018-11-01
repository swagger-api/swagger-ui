const fs = require("fs")
const path = require("path")

const translator = require("./translator")
const configSchema = require("./variables")

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
      ${END_MARKER}
${afterEndMarkerContent}`)

function indent(str, len, fromLine) {

  return str
    .split("\n")
    .map((line, i) => {
      if(i + 1 >= fromLine) {
        return `${Array(len + 1).join(" ")}${line}`
      } else {
        return line
      }
    })
    .join("\n")
}