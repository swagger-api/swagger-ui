const expect = require("expect")

describe("onComplete option", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .pause(80)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/petstore.json")
      .click("button.download-url-button")
      .pause(1000)

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
