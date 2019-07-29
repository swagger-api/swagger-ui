describe("bug #4445: callback-via-$ref rendering", function () {
    let mainPage
    beforeEach(function (client, done) {
        mainPage = client
            .url("localhost:3230")
            .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4445.yaml")
            .click("button.download-url-button")
            .pause(1000)

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("expands an operation that has a visible callback", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
            .click(".opblock")
            .waitForElementVisible(".opblock-body", 5000)
            .click(".opblock-section-header > .tab-header > div.tab-item:nth-of-type(2)")
            .waitForElementVisible(".callbacks-container .opblock", 5000)
            .click(".callbacks-container .opblock")
            .waitForElementVisible(".callbacks-container .opblock-body", 5000)
            .assert.containsText(".callbacks-container .opblock-description-wrapper:nth-of-type(2) p", "subscription payload")

        client.end()
    })
})
