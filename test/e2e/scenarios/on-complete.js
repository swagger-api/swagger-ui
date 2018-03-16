const expect = require("expect")

describe("onComplete option", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3200")
      .page.main()

    client.waitForElementVisible(".opblock-tag-section", 5000)
    done()
  })

  it("triggers the page-provided onComplete exactly 1 times", function (client, done) {
    client.execute(function() {
      return window.completeCount
    }, [], (result) => {
      expect(result.value).toEqual(1)
      client.end()
    })
  })
})
