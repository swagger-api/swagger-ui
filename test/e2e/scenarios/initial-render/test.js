describe("initial render", function () {
  let mainPage


  describe("for topbar", function () {
    let topbar
    before(function (client, done) {
      done()
    })

    after(function (client, done) {
      client.end(function () {
        done()
      })
    })

    afterEach(function (client, done) {
      done()
    })

    beforeEach(function (client, done) {
      mainPage = client
        .url("localhost:3200")
        .page.main()

      topbar = mainPage.section.topbar

      client.waitForElementVisible('.download-url-input', 5000)
        .pause(1000)
        .clearValue('.download-url-input')
        .setValue('.download-url-input', 'http://localhost:3200/test-specs/1.json')
        .click('button.download-url-button')

      done()
    })

    it("renders section", function (client) {
      mainPage.expect.section("@topbar").to.be.visible
      client.end()
    })

    it("renders input box", function (client) {
      topbar.expect.element("@inputBox").to.be.visible
      client.end()
    })

    it("renders explore button", function (client) {
      topbar.expect.element("@btnExplore").to.be.visible

      client.end()
    })
  })

  describe("for information", function () {
    let informationContainer, topbar
    beforeEach(function (client, done) {
      
      mainPage = client
        .url("localhost:3200")
        .page.main()
      client.waitForElementVisible('.download-url-input', 5000)
        .pause(1000)
        .clearValue('.download-url-input')
        .setValue('.download-url-input', 'http://localhost:3200/test-specs/1.json')
        .click('button.download-url-button')

      informationContainer = mainPage.section.informationContainer
        
      done()
    })

    it("renders section", function (client) {
      mainPage.expect.section("@informationContainer").to.be.visible.before(5000)

      client.end()
    })

    it("renders title", function (client) {
      informationContainer.waitForElementVisible("@title", 5000)
        .assert.containsText("@title", "Swagger Petstore")
        .assert.containsText("@version", "1.0.0")

      client.end()
    })

    it("renders base url", function (client) {
      informationContainer.waitForElementVisible("@baseUrl", 5000)
        .assert.containsText("@baseUrl", "[ Base url: localhost:3204/]")

      client.end()
    })
    
    it("render main url", function (client) {
      informationContainer.waitForElementVisible("@mainUrl", 5000)
        .assert.attributeEquals("@mainUrl", "href", "http://localhost:3200/test-specs/1.json")
        .assert.containsText("@mainUrlContent", "http://localhost:3200/test-specs/1.json")

      client.end()
    })

    it("render description", function (client) {
      informationContainer.waitForElementVisible("@description", 5000)
        .assert.containsText("@description", "This is a sample server Petstore server. You can find out more about Swagger at http://swagger.io or on irc.freenode.net, #swagger. For this sample, you can use the api key special-key to test the authorization filters.")
        .assert.attributeEquals("@swaggerUrl", "href", "http://swagger.io/")
        .assert.attributeEquals("@swaggerircUrl", "href", "http://swagger.io/irc/")

      client.end()
    })

    it("render terms-of-service", function (client) {
      informationContainer.waitForElementVisible("@termsLink", 5000)
        .assert.attributeEquals("@termsLink", "href", "http://swagger.io/terms/")
        .assert.containsText("@termsLink", "Terms of service")

      client.end()
    })

    it("render contact-the-developer", function (client) {
      informationContainer.waitForElementVisible("@contactDevLink", 5000)
        .assert.attributeEquals("@contactDevLink", "href", "mailto:apiteam@swagger.io")
        .assert.containsText("@contactDevLink", "Contact the developer")

      client.end()
    })

    it("render apache", function (client) {
      informationContainer.waitForElementVisible("@apacheLink", 5000)
        .assert.attributeEquals("@apacheLink", "href", "http://www.apache.org/licenses/LICENSE-2.0.html")
        .assert.containsText("@apacheLink", "Apache 2.0")
      
      client.end()
    })

    it("render about swagger", function (client) {
      informationContainer.waitForElementVisible("@aboutSwaggerLink", 5000)
        .assert.attributeEquals("@aboutSwaggerLink", "href", "http://swagger.io/")
        .assert.containsText("@aboutSwaggerLink", "Find out more about Swagger")
      
      client.end()
    })
  })
  describe("for scheme", function () {
    let schemeContainer
    beforeEach(function (client, done) {

      mainPage = client
        .url("localhost:3200")
        .page.main()
      schemeContainer = mainPage.section.schemeContainer
      done()
    })

    it("render section", function (client) {
      mainPage.expect.section("@schemeContainer").to.be.visible.before(5000)

      client.end()
    })
    it("render scheme option", function (client) {
      schemeContainer.waitForElementVisible("@schemeTitle", 5000)
        .assert.containsText("@schemeTitle", "Schemes")
        .expect.element("@httpOption").to.be.selected

      client.end()
    })

    it("render authorized button", function (client) {
      schemeContainer.waitForElementVisible("@btnAuthorize", 5000)
        .expect.element("@btnAuthorize").to.be.visible

      client.end()
    })
    it("render click event", function(client) {
      schemeContainer.waitForElementVisible("@btnAuthorize", 5000)
        .click("@btnAuthorize")
        .assert.visible("@authorizationModal")
        .assert.containsText("@appName", "Application: your-app-name")
        .assert.containsText("@authorizationUrl", "http://petstore.swagger.io/oauth/dialog")
        .assert.containsText("@flow", "implicit")
        .assert.value("@inputClientID", "your-client-id")

      client.end()
    })
  })
})
