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
            .url(client.globals.baseAppUrl)
            .page.main()

        topbar = mainPage.section.topbar

        client.waitForElementVisible(".download-url-input", 10000)
            .pause(5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", client.globals.specPath)
            .click("button.download-url-button")
            .pause(1000)

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
})
