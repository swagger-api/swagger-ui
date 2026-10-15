// A minimal, dependency-free HTTP server used to prove that Swagger UI's
// "Try it out" flow sends a *real* HTTP QUERY request (RFC 10008), rather
// than a POST/GET request labeled "QUERY" in the UI.
//
// Deliberately implemented with the raw `http` module (not Express) so that
// nothing in the stack normalizes or rejects the QUERY method token before
// we can observe `req.method`.
const http = require("http")

const PORT = 3232

function startServer() {
  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "QUERY, GET, POST, OPTIONS")
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    )

    if (req.method === "OPTIONS") {
      // CORS preflight
      res.writeHead(204)
      res.end()
      return
    }

    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8")
      let parsedBody = null

      if (rawBody) {
        try {
          parsedBody = JSON.parse(rawBody)
        } catch (e) {
          parsedBody = rawBody
        }
      }

      res.setHeader("Content-Type", "application/json")
      res.writeHead(200)
      res.end(
        JSON.stringify({
          // This is the actual method the server received on the wire,
          // not something the UI merely displayed.
          method: req.method,
          received: true,
          url: req.url,
          contentType: req.headers["content-type"] || null,
          body: parsedBody,
        })
      )
    })
  })

  server.listen(PORT)

  return function stopServer() {
    server.close()
  }
}

module.exports = startServer

if (require.main === module) {
  // for debugging
  startServer()
}
