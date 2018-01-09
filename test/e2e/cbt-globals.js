/* eslint-disable no-console */
var cbt = require("cbt_tunnels")


module.exports = {
  baseAppUrl: "http://swagger-ui-ci-asset-deployment-test.surge.sh",
  specPath: "http://local:3204/petstore.json",
  visibleTimeout: 10000,

  beforeEach: function(done) {
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
  afterEach: function(done) {
    console.log("Closing Down Tunnel")
    cbt.stop()
    done()
  }
}
