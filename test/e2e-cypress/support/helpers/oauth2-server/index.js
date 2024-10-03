// from https://github.com/pedroetb/node-oauth2-server-example

let Http = require("http")
let path = require("path")
let express = require("express")
let bodyParser = require("body-parser")
let oauthserver = require("@node-oauth/oauth2-server")
let cors = require("cors")

let app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const oauth = new oauthserver({
  model: require("./model.js"),
  grants: ["password", "client_credentials", "implicit"],
  debug: true
})

// Modified token code to get rid of deprecated "grant" call
app.all("/oauth/token", (req, res, next) => {
  let request = new Request(req)
  let response = new Response(res)
  return oauth.token(request, response)
  .then((token) => {
    res.locals.oauth = {token: token}
    next()
  })
  .catch((e) => console.log(e))
})

app.get("/swagger.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "swagger.yaml"))
})

app.get("*", (req, res) => {
    let request = new Request(req)
    let response = new Response(res)
    return oauth.authorize(request, response)
    .then ((req, res) => {
      res.send("Secret secrets are no fun, secret secrets hurt someone.")
    })
    .catch((e) => console.log(e))
  })


// app.use(oauth.errorHandler())

function startServer() {
  let httpServer = Http.createServer(app)
  httpServer.listen("3231")

  return function stopServer() {
    httpServer.close()
  }
}

module.exports = startServer

if (require.main === module) {
  // for debugging
  startServer()
}