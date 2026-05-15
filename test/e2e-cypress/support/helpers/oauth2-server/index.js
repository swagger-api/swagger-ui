// from https://github.com/pedroetb/node-oauth2-server-example

let Http = require("http")
let path = require("path")
let express = require("express")
let bodyParser = require("body-parser")
let OAuth2Server = require("@node-oauth/oauth2-server")
let cors = require("cors")

let app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

let oauth = new OAuth2Server({
  model: require("./model.js"),
  grants: ["password", "client_credentials", "implicit"],
  debug: true
})

app.all("/oauth/token", function (req, res) {
  let request = new OAuth2Server.Request(req)
  let response = new OAuth2Server.Response(res)

  oauth.token(request, response)
    .then(function () {
      res.set(response.headers)
      res.status(response.status).json(response.body)
    })
    .catch(function (err) {
      res.status(err.code || 500).json(err)
    })
})

app.get("/swagger.yaml", function (req, res) {
  res.sendFile(path.join(__dirname, "swagger.yaml"))
})

function authenticate(req, res, next) {
  let request = new OAuth2Server.Request(req)
  let response = new OAuth2Server.Response(res)

  oauth.authenticate(request, response)
    .then(function () {
      next()
    })
    .catch(function (err) {
      res.status(err.code || 401).json(err)
    })
}

app.get("*", authenticate, function (req, res) {
  res.send("Secret secrets are no fun, secret secrets hurt someone.")
})

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
