describe("bug #4485: operation metadata storage when referenced via path item $ref", function () {
    let mainPage
    beforeEach(function (client, done) {
        mainPage = client
            .url("localhost:3230")
            .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
            .pause(2000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4485/main.yaml")
            .click("button.download-url-button")
            .pause(1000)

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("sets a consumes value for a body parameter correctly", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
            .click(".opblock")
            .waitForElementVisible(".opblock-body", 5000)
            .click("button.btn.try-out__btn")
            .click("select.content-type [value=\"application/xml\"]")
            .pause(500)
            .assert.value("select.content-type", "application/xml")

        client.end()
    })
})
