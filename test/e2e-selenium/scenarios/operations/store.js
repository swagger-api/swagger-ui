describe("render store api container", function(){
    let mainPage
    let apiWrapper
    beforeEach( function(client, done){
        mainPage = client
            .url("localhost:3230")
            .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
            .pause(3000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3230/test-specs/petstore.json")
            .click("button.download-url-button")
            .pause(1000)

        apiWrapper = mainPage.section.apiWrapper

        done()
    })
    afterEach(function (client, done) {
        done()
    })
    it("test rendered store container", function(client){
        apiWrapper.waitForElementVisible("@storeAPIWrapper", 5000)
            .expect.element("@storeAPIWrapper").to.be.visible

    client.end()
    })
    it("callapse store wrapper", function(client){
        apiWrapper.waitForElementVisible("@storeAPIWrapper", 5000)
            .click("@storeAPIWrapperBar")
            .assert.cssClassNotPresent("@storeAPIWrapper", "is-open")

        client.end()
    })
    it("render get /store/inventory api container", function (client) {
        apiWrapper.waitForElementVisible("@storeOperationGetContainer", 5000)
            .assert.containsText("@storeOperationGetTitle", "/store/inventory")
            .click("@storeOperationGetCollpase")
            .waitForElementVisible("@storeOperationGetCollapseContainer", 5000)
            .click("@storeOperationGetTryBtn")
            .waitForElementVisible("@storeOperationGetExecuteBtn", 1000)
            .click("@storeOperationGetTryBtn")
            .assert.cssClassNotPresent("@storeOperationGetTryBtn", "cancel")
            
        client.end()
    })

    it("Testing get /store/inventory api Mock data ", function (client) {
        apiWrapper.waitForElementVisible("@storeOperationGetContainer", 5000)
            .assert.containsText("@storeOperationGetTitle", "/store/inventory")
            .click("@storeOperationGetCollpase")
            .waitForElementVisible("@storeOperationGetCollapseContainer", 3000)
            .click("@storeOperationGetTryBtn")
            .waitForElementVisible("@storeOperationGetExecuteBtn", 1000)
            .click("@storeOperationGetExecuteBtn")
            .waitForElementVisible("@storeOperationResponseProps1")
            .assert.containsText("@storeOperationResponseProps1", "0")
            .assert.containsText("@storeOperationResponseProps2", "0")
            .assert.containsText("@storeOperationResponseProps3", "0")
            .click("@storeOperationGetTryBtn")
            .assert.cssClassNotPresent("@storeOperationGetTryBtn", "cancel")
            
        client.end()
    })

    it("render post /store/order api container", function (client) {
        apiWrapper.waitForElementVisible("@storeOperationPostContainer")
            .assert.containsText("@storeOperationPostTitle", "/store/order")
            .click("@storeOperationPostCollpase")
            .waitForElementVisible("@storeOperationPostCollapseContainer", 3000)
            .click("@storeOperationPostTryBtn")
            .waitForElementVisible("@storeOperationPostExecuteBtn", 1000)
            .click("@storeOperationPostTryBtn")
            .assert.cssClassNotPresent("@storeOperationPostTryBtn", "cancel")
            
        client.end()
    })

    it("Testing post /store/order api Mock Data", function (client) {
        apiWrapper.waitForElementVisible("@storeOperationPostContainer")
            .assert.containsText("@storeOperationPostTitle", "/store/order")
            .click("@storeOperationPostCollpase")
            .waitForElementVisible("@storeOperationPostCollapseContainer", 3000)
            .click("@storeOperationPostTryBtn")
            .waitForElementVisible("@storeOperationPostExecuteBtn", 1000)
            .click("@storeOperationPostExecuteBtn")
            .waitForElementVisible("@storeOperationPostResponseId")
            .assert.containsText("@storeOperationPostResponseId", "0")
            .assert.containsText("@storeOperationPostResponsePetId", "0")
            .assert.containsText("@storeOperationPostResponseQuantity", "0")
            .assert.containsText("@storeOperationPostResponseStatus", "placed")
            .assert.containsText("@storeOperationPostResponseComplete", "false")
            .click("@storeOperationPostTryBtn")
            .assert.cssClassNotPresent("@storeOperationPostTryBtn", "cancel")
            
        client.end()
    })
    it("render delete /store/order/{orderId} api container", function (client) {
        apiWrapper.waitForElementVisible("@storeOperationDeleteContainer")
            .assert.containsText("@storeOperationDeleteTitle", "/store/order/{orderId}")
            .click("@storeOperationDeleteCollpase")
            .waitForElementVisible("@storeOperationDeleteCollapseContainer", 3000)
            .click("@storeOperationDeleteTryBtn")
            .waitForElementVisible("@storeOperationDeleteExecuteBtn", 1000)
            .click("@storeOperationDeleteExecuteBtn")
            .waitForElementVisible("@storeOperationGetResponseHeaders", "content-type: application/xml")
            .click("@storeOperationDeleteTryBtn")
            .assert.cssClassNotPresent("@storeOperationDeleteTryBtn", "cancel")
            
        client.end()
    })
})