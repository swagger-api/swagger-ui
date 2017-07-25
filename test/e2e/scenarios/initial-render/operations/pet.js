
describe("render pet api container", function () {
    let mainPage
    let apiWrapper
    beforeEach(function (client, done) {
        mainPage = client
            .url("localhost:3200")
            .page.main()

        client.waitForElementVisible(".download-url-input", 5000)
            .pause(2000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3200/test-specs/1.json")
            .click("button.download-url-button")
            .pause(1000)

        apiWrapper = mainPage.section.apiWrapper

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("render section", function (client) {
        mainPage.expect.section("@apiWrapper").to.be.visible.before(5000)
        client.end()
    })
    it("test rendered pet container", function (client) {
        apiWrapper.waitForElementVisible("@petAPIWrapper", 5000)
            .expect.element("@petAPIWrapper").to.be.visible

        client.end()
    })
    it("collapse pet wrapper", function (client) {
        apiWrapper.waitForElementVisible("@petAPIWrapper", 5000)
            .click("@petAPIWrapperBar")
            .assert.cssClassNotPresent("@petAPIWrapper", "is-open")

        client.end()
    })
    it("render post /pet api container", function (client) {
        apiWrapper.waitForElementVisible("@petOperationPostContainer", 5000)
            .assert.containsText("@petOperationPostTitle", "/pet")
            .click("@petOperationPostCollpase")
            .waitForElementVisible("@petOperationPostCollapseContainer", 3000)
            .click("@petOperationPostTryBtn")
            .waitForElementVisible("@petOperationPostTryText", 1000)
            .waitForElementVisible("@petOperationPostExecuteBtn", 1000)
            .click("@petOperationPostTryBtn")
            .assert.cssClassNotPresent("@petOperationPostTryBtn", "cancel")
            

        client.end()
    })

    it("render put /pet api container", function (client) {
        apiWrapper.waitForElementVisible("@petOperationPutContainer", 5000)
            .assert.containsText("@petOperationPutTitle", "/pet")
            .click("@petOperationPutCollpase")
            .waitForElementVisible("@petOperationPutCollapseContainer", 3000)
            .click("@petOperationPutTryBtn")
            .waitForElementVisible("@petOperationPutTryText", 1000)
            .waitForElementVisible("@petOperationPutExecuteBtn", 1000)
            .click("@petOperationPutTryBtn")
            .assert.cssClassNotPresent("@petOperationPutTryBtn", "cancel")
            

        client.end()
    })

    it("render get /pet api container", function (client) {
        apiWrapper.waitForElementVisible("@petOperationGetByTagContainer", 5000)
            .assert.containsText("@petOperationGetByTagTitle", "/pet/findByTags")
            .click("@petOperationGetByTagCollpase")
            .waitForElementVisible("@petOperationGetByTagCollapseContainer", 3000)
            .click("@petOperationGetByTagTryBtn")
            .waitForElementVisible("@petOperationGetByTagTryAdded", 1000)
            .waitForElementVisible("@petOperationGetByTagExecuteBtn", 1000)
            .click("@petOperationGetByTagTryBtn")
            .assert.cssClassNotPresent("@petOperationGetByTagTryBtn", "cancel")
            
        client.end()
    })

    it("render delete /pet api container", function (client) {
        apiWrapper.waitForElementVisible("@petOperationDeleteContainer", 5000)
            .assert.containsText("@petOperationDeleteTitle", "/pet/{petId}")
            .click("@petOperationDeleteCollpase")
            .waitForElementVisible("@petOperationDeleteCollapseContainer", 3000)
            .click("@petOperationDeleteTryBtn")
            .waitForElementVisible("@petOperationDeleteExecuteBtn", 1000)
            .click("@petOperationDeleteTryBtn")
            .assert.cssClassNotPresent("@petOperationDeleteTryBtn", "cancel")
            
        client.end()
    })
})