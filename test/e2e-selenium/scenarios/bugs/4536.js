describe("bug #4536: model name consistency", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4536.yaml")
      .click("button.download-url-button")
      .pause(1000)

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  it("consistently displays a model's name regardless of expansion state", function (client) {
    client.waitForElementVisible("span.model.model-title", 10000)
      .assert.containsText("span.model.model-title", "TitleName")
      .click("span.model.model-title")
      .pause(500)
      .assert.containsText("span.model-title__text", "TitleName")

    client.end()
  })
})
