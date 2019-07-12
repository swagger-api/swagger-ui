describe("bug #4374: OAS3 parameters should be visibly validated in Try-It-Out", function () {
    let mainPage
    beforeEach(function (client, done) {
        mainPage = client
            .url("localhost:3230")
            .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 10000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "/test-specs/bugs/4374.yaml")
            .click("button.download-url-button")
            .pause(1000)

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("indicates an error when a required parameter is not selected", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
            .assert.containsText(".opblock-summary-path span", "/pet/findByStatus")
            .click(".opblock")
            .waitForElementVisible(".opblock.is-open", 5000)
            .click(".try-out__btn")
            .click(".btn.execute")
            .pause(100)
            .assert.cssClassPresent(".parameters-col_description select", "invalid")

        client.end()
    })
})
