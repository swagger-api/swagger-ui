describe("bug #4409: operationId normalization and layout tracking", function () {
    let mainPage
    beforeEach(function (client, done) {
        mainPage = client
            .url("localhost:3230")
            .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
            .pause(5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4409.yaml")
            .click("button.download-url-button")
            .pause(1000)

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("expands an operation that has a normalizable operationId", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
            .assert.containsText(".opblock-summary-path span", "/myApi")
            .click(".opblock")
            .waitForElementVisible(".opblock-body", 5000)
            .assert.cssClassPresent(".opblock", "is-open")

        client.end()
    })
})
