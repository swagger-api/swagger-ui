describe("bug: unable to change array input", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "/test-specs/bugs/frozen-array-input.yaml")
      .click("button.download-url-button")

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  it("consistently displays a model's name regardless of expansion state", function (client) {
    client.waitForElementVisible(".opblock-summary-description", 10000)
      .assert.containsText("span.opblock-summary-path > a > span", "/test")
      .click("#operations-default-get_test")
      .pause(500)
      .click("button.btn.try-out__btn")
      .elements("css selector", ".json-schema-form-item", function (result) {
        this.assert.equal(result.value.length, 2, "initial number of array item inputs")
      })
      .click(".json-schema-form-item-add")
      .elements("css selector", ".json-schema-form-item", function (result) {
        this.assert.equal(result.value.length, 3, "number of array item inputs after clicking add")
      })
      .click(".json-schema-form-item-remove")
      .click(".json-schema-form-item-remove")
      .click(".json-schema-form-item-remove")
      .elements("css selector", ".json-schema-form-item", function (result) {
        this.assert.equal(result.value.length, 0, "number of array item inputs after removing all items")
      })
      .click(".json-schema-form-item-add")
      .setValue(".json-schema-form-item input", "myValue123")
      .click("button.execute")
      .pause(100)
      .assert.containsText(".request-url pre", "http://localhost:3230/test?fields=myValue123")
    client.end()
  })
})
