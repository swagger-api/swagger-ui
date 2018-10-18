// from https://github.com/pedroetb/node-oauth2-server-example

var express = require("express")
var bodyParser = require("body-parser")
var oauthserver = require("oauth2-server")

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.oauth = oauthserver({
  model: require("./model.js"),
  grants: ["password", "client_credentials"],
  debug: true
})

app.all("/oauth/token", app.oauth.grant())

app.get("/", app.oauth.authorise(), function (req, res) {
  res.send("Secret secrets are no fun, secret secrets hurt someone.")
})

app.use(app.oauth.errorHandler())

app.listen(3000)