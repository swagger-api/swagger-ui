// from https://github.com/pedroetb/node-oauth2-server-example

var Http = require("http")
var path = require("path")
var express = require("express")
var bodyParser = require("body-parser")
var oauthserver = require("oauth2-server")
var cors = require("cors")

var app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.oauth = oauthserver({
  model: require("./model.js"),
  grants: ["password", "client_credentials", "implicit"],
  debug: true
})

app.all("/oauth/token", app.oauth.grant())

app.get("/swagger.yaml", function (req, res) {
  res.sendFile(path.join(__dirname, "swagger.yaml"))
})

app.get("*", app.oauth.authorise(), function (req, res) {
  res.send("Secret secrets are no fun, secret secrets hurt someone.")
})

app.use(app.oauth.errorHandler())

function startServer() {
  var httpServer = Http.createServer(app)
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