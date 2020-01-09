describe("bug #4756: enum initial values", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4756.yaml")
      .click("button.download-url-button")
      .pause(1000)

    done()
  })

  afterEach(function (client, done) {
    done()
  })

  it("sets a required initial value based the first enum value", function (client) {
    client.waitForElementVisible(".opblock-tag-section", 10000)
      .click("#operations-default-post_zero")
      .waitForElementVisible(".opblock.is-open", 5000)
      .click("button.btn.try-out__btn")
      .click("button.btn.execute")
      .waitForElementVisible(".request-url", 2000)
      .assert.containsText(".request-url > pre", "http://www.example.com/test/API/zero?one=0")
    client.end()
  })

  it("sets a required initial value based on a default value", function (client) {
    client.waitForElementVisible(".opblock-tag-section", 10000)
      .click("#operations-default-post_one")
      .waitForElementVisible(".opblock.is-open", 5000)
      .click("button.btn.try-out__btn")
      .click("button.btn.execute")
      .waitForElementVisible(".request-url", 2000)
      .assert.containsText(".request-url > pre", "http://www.example.com/test/API/one?one=1")
    client.end()
  })
})
