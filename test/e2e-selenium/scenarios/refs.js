describe("Remote $ref rendering", function () {
  let mainPage
  beforeEach(function (client, done) {

    mainPage = client
    // expand the models so we don't have to manually do it
    .url("localhost:3230?defaultModelsExpandDepth=5")
    .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
    .pause(2000)
    .clearValue(".download-url-input")
    .setValue(".download-url-input", "http://localhost:3230/test-specs/refs/api1.yaml")
    .click("button.download-url-button")
    .pause(1000)


    done()
  })

  it("renders a remote $ref correctly", function (client) {
    mainPage.expect.element("#model-TestResponse > span > div > span > span > span.inner-object > table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span > div > div > p").text.to.equal("this is an api2prop")

    client.end()
  })
})
