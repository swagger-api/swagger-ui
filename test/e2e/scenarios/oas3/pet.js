describe("render pet api container", function () {
  let mainPage
  let apiWrapper
  beforeEach(function (client, done) {
    mainPage = client
    .url("localhost:3230")
    .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
    .pause(5000)
    .clearValue(".download-url-input")
    .setValue(".download-url-input", "http://localhost:3230/test-specs/petstore.openapi.yaml")
    .click("button.download-url-button")
    .pause(1000)

    apiWrapper = mainPage.section.apiWrapper

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  describe("GET /pet/{petId}", () => {
    it("should render Try-It-Out flow correctly", function (client) {
      apiWrapper.waitForElementVisible("#operations-pet-updatePetWithForm", 10000)
      .assert.containsText("#operations-pet-updatePetWithForm > div > span.opblock-summary-path > a > span", "/pet")
      .click("#operations-pet-updatePetWithForm")
      .waitForElementVisible("#operations-pet-updatePetWithForm > div:nth-child(2) > div", 5000)
      .click("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.opblock-section > div.opblock-section-header > div.try-out > button")
      .waitForElementVisible("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.execute-wrapper > button", 1000)
      .click("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.execute-wrapper > button")
      .assert.cssClassNotPresent("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.execute-wrapper > button", "cancel")

      client.end()
    })

    it("should have stable input values", function (client) {
      client.waitForElementVisible("#operations-pet-updatePetWithForm", 10000)
      .assert.containsText("#operations-pet-updatePetWithForm > div > span.opblock-summary-path > a > span", "/pet")
      .click("#operations-pet-updatePetWithForm")
      .waitForElementVisible("#operations-pet-updatePetWithForm > div:nth-child(2) > div", 5000)
      .click("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.opblock-section > div.opblock-section-header > div.try-out > button")
      .waitForElementVisible("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.execute-wrapper > button", 1000)
      .setValue("#operations-pet-updatePetWithForm td.parameters-col_description > input", "12345")
      .click("#operations-pet-updatePetWithForm > div:nth-child(2) > div > div.execute-wrapper > button")
      .pause(800) // for swagger-api/swagger-ui#4269, which happens above 350ms
      .assert.containsText("#operations-pet-updatePetWithForm div.responses-inner > div > div > div:nth-child(2) > div > pre", "http://localhost:3204/pet/12345")
      .assert.value("#operations-pet-updatePetWithForm td.parameters-col_description > input", "12345")

      client.end()
    })
  })
})
