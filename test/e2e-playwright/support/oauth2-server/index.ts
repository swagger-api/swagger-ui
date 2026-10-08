/**
 * @prettier
 */
// from https://github.com/pedroetb/node-oauth2-server-example
import http from "node:http"
import path from "node:path"
import express from "express"
import bodyParser from "body-parser"
import OAuth2Server from "@node-oauth/oauth2-server"
import cors from "cors"

import model from "./model"

export const OAUTH2_SERVER_PORT = 3231

const app = express()

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

const oauth = new OAuth2Server({
  // the model only implements the callbacks needed by the grants enabled below
  model: model as unknown as OAuth2Server.PasswordModel,
})

app.all("/oauth/token", (req, res) => {
  const request = new OAuth2Server.Request(req)
  const response = new OAuth2Server.Response(res)

  oauth
    .token(request, response)
    .then(() => {
      res.set(response.headers)
      res.status(response.status ?? 200).json(response.body)
    })
    .catch((err: { code?: number }) => {
      res.status(err.code || 500).json(err)
    })
})

app.get("/swagger.yaml", (req, res) => {
  res.sendFile(path.join(__dirname, "swagger.yaml"))
})

const authenticate: express.RequestHandler = (req, res, next) => {
  const request = new OAuth2Server.Request(req)
  const response = new OAuth2Server.Response(res)

  oauth
    .authenticate(request, response)
    .then(() => {
      next()
    })
    .catch((err: { code?: number }) => {
      res.status(err.code || 401).json(err)
    })
}

app.get("*", authenticate, (req, res) => {
  res.send("Secret secrets are no fun, secret secrets hurt someone.")
})

export const startServer = async (
  port: number = OAUTH2_SERVER_PORT
): Promise<() => Promise<void>> => {
  const httpServer = http.createServer(app)

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject)
    httpServer.listen(port, resolve)
  })

  return () =>
    new Promise<void>((resolve, reject) => {
      httpServer.close((err) => (err ? reject(err) : resolve()))
    })
}

if (require.main === module) {
  // for debugging
  startServer().then((stop) => {
    console.error(`OAuth2 server listening on ${OAUTH2_SERVER_PORT}`)
    process.on("SIGINT", () => stop().then(() => process.exit(0)))
  })
}
