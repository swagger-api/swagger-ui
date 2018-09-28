// Write the version number to dist/version.txt so users can check which version
// they are running at host/swagger-ui/version.txt
const sup = require("./package.json")
const fs = require("fs")
fs.writeFileSync("dist/version.txt", `${sup.version}\n`)

                 
