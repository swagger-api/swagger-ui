describe("Render Model Wrapper", function () {
  let modelWrapper, mainPage

  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()
    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/petstore.json")
      .click("button.download-url-button")
      .pause(1000)

    modelWrapper = mainPage.section.modelWrapper

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  it("Render model wrapper", function (client) {
    mainPage.expect.section("@modelWrapper").to.be.visible.before(5000)

    client.end()
  })

  it("Render model wrapper collapse", function (client) {
    modelWrapper.waitForElementVisible("@modelContainer", 5000)
      .click("@modelCollapse")
      .assert.cssClassNotPresent("@modelContainer", "is-open")

    client.end()
  })

  it("Testing order model", function (client) {
    modelWrapper.waitForElementVisible("@orderModel")
      .click("@orderModelCallapse")
      .assert.cssClassNotPresent("@orderModelCallapse", "callapsed")

    client.end()
  })

  it("Testing category model", function (client) {
    modelWrapper.waitForElementVisible("@categoryModel")
      .click("@categoryModelCallapse")
      .assert.cssClassNotPresent("@categoryModelCallapse", "callapsed")

    client.end()
  })
  it("Testing user model", function (client) {
    modelWrapper.waitForElementVisible("@userModel")
      .click("@userModelCallapse")
      .assert.cssClassNotPresent("@userModelCallapse", "callapsed")

    client.end()
  })
  it("Testing tag model", function (client) {
    modelWrapper.waitForElementVisible("@tagModel")
      .click("@tagModelCallapse")
      .assert.cssClassNotPresent("@tagModelCallapse", "callapsed")

    client.end()
  })
  it("Testing pet model", function (client) {
    modelWrapper.waitForElementVisible("@petModel")
      .click("@petModelCallapse")
      .assert.cssClassNotPresent("@petModelCallapse", "callapsed")

    client.end()
  })
  it("Testing apiResponse model", function (client) {
    modelWrapper.waitForElementVisible("@apiResponseModel")
      .click("@apiResponseModelCallapse")
      .assert.cssClassNotPresent("@apiResponseModelCallapse", "callapsed")

    client.end()
  })
})
