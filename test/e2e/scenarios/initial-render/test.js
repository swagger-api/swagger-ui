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
    let informationContainer
    beforeEach(function (client, done) {
      mainPage = client
        .url("localhost:3200")
        .page.main()
      informationContainer = mainPage.section.informationContainer
      done()
    })

    it("renders section", function (client) {
      mainPage.expect.section("@informationContainer").to.be.visible.before(5000)

      client.end()
    })

    it("renders title", function (client) {
      // informationContainer.waitForElementVisible("@title", 5000, function() {
      //   informationContainer.expect.element("@title").to.contain.text("Swagger Petstore")
      //   informationContainer.expect.element("@version").to.contain.text("1.0.0")

      //   client.end()
      // })
      informationContainer.waitForElementVisible("@title", 5000)
        .assert.containsText("@title", "Swagger Petstore")
        .assert.containsText("@version", "1.0.0")

      client.end()
    })
  })
})
