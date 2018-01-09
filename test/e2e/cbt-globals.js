/* eslint-disable no-console */
var cbt = require("cbt_tunnels")


module.exports = {
  baseAppUrl: "http://swagger-ui-ci-asset-deployment-test.surge.sh",

  // use rawgit.com to get test/e2e/specs/petstore.json from master
  // not a great solution, but CBT's proxy is too slow to fetch
  // the data directly.
  specPath: "https://rawgit.com/swagger-api/swagger-ui/master/test/e2e/specs/petstore.json",
  visibleTimeout: 10000,

  before: function(done) {
    console.log("Starting up tunnel")
    cbt.start({
      username: process.env.CBT_USERNAME || "",
      authkey: process.env.CBT_AUTHKEY || ""
    }, function(err, data) {
      if (err) {
        done(err)
      } else {
        done(data)
      }
    })
  },
  after: function(done) {
    console.log("Closing Down Tunnel")
    cbt.stop()
    done()
  }
}
