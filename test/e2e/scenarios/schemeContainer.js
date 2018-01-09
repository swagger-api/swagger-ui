describe("Render scheme", function () {
    let mainPage
    let schemeContainer
    beforeEach(function (client, done) {

        mainPage = client
        .url(client.globals.baseAppUrl)
        .page.main()

        schemeContainer = mainPage.section.schemeContainer

        client.waitForElementVisible(".download-url-input", client.globals.visibleTimeout || 5000)
        .pause(client.globals.visibleTimeout || 5000)
        .clearValue(".download-url-input")
        .setValue(".download-url-input", client.globals.specPath)
        .click("button.download-url-button")
        .pause(1000)


        done()
    })

    it("render section", function (client) {
        mainPage.expect.section("@schemeContainer").to.be.visible.before(client.globals.visibleTimeout || 5000)

        client.end()
    })
    it("render scheme option", function (client) {
        schemeContainer.waitForElementVisible("@httpOption", client.globals.visibleTimeout || 5000)
        .expect.element("@httpOption").to.be.selected

        client.end()
    })

    it("render authorized button", function (client) {
        schemeContainer.waitForElementVisible("@btnAuthorize", client.globals.visibleTimeout || 5000)
        .expect.element("@btnAuthorize").to.be.visible

        client.end()
    })
    it("render click event", function(client) {
        schemeContainer.waitForElementVisible("@btnAuthorize", client.globals.visibleTimeout || 5000)
        .click("@btnAuthorize")
        .assert.visible("@authorizationModal")
        .assert.containsText("@appName", "Application: your-app-name")
        .assert.containsText("@authorizationUrl", "http://petstore.swagger.io/oauth/dialog")
        .assert.containsText("@flow", "implicit")
        .assert.value("@inputClientID", "your-client-id")

        client.end()
    })
})
