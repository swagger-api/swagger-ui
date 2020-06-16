describe("render pet api container", function () {
  let mainPage
  let apiWrapper
  beforeEach(function (client, done) {
    mainPage = client
    .url("localhost:3230")
    .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
    .clearValue(".download-url-input")
    .setValue(".download-url-input", "http://localhost:3230/test-specs/callbacks.openapi.yaml")
    .click("button.download-url-button")
    .pause(1000)

    apiWrapper = mainPage.section.apiWrapper

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  describe("POST /pet", () => {
    it("should render a callback correctly", function (client) {
      apiWrapper.waitForElementVisible("#operations-pet-addPet", 10000)
      // Expand the operation
      .click("#operations-pet-addPet")
      .waitForElementVisible("#operations-pet-addPet > div:nth-child(2) > div", 5000)
      // Switch to Callbacks tab
      .click("#operations-pet-addPet div.tab-header > div.tab-item.false > h4 > span")
      .waitForElementVisible("#operations-pet-addPet div.callbacks-container", 5000)
      .assert.containsText("#operations--post_request_body__url > div > span.opblock-summary-path", "$request.body#/url")
      .click("#operations--post_request_body__url")
      .waitForElementVisible("#operations--post_request_body__url div.response-col_description__inner > div > div > p", 5000)
      .assert.containsText("#operations--post_request_body__url div.response-col_description__inner > div > div > p", "webhook successfully processed and no retries will be performed")


      client.end()
    })
  })
})
