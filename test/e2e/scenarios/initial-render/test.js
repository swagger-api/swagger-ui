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

        client.waitForElementVisible(".download-url-input", 10000)
            .pause(5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3200/test-specs/1.json")
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
    describe("Render scheme", function () {
        let schemeContainer
        beforeEach(function (client, done) {

            mainPage = client
            .url("localhost:3200")
            .page.main()

            schemeContainer = mainPage.section.schemeContainer

            client.waitForElementVisible(".download-url-input", 5000)
            .pause(5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3200/test-specs/1.json")
            .click("button.download-url-button")
            .pause(1000)


            done()
        })

        it("render section", function (client) {
            mainPage.expect.section("@schemeContainer").to.be.visible.before(5000)

            client.end()
        })
        it("render scheme option", function (client) {
            schemeContainer.waitForElementVisible("@httpOption", 5000)
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
    describe("render informationContainer", function () {
        let mainPage
        let informationContainer
        beforeEach(function (client, done) {
            
            mainPage = client
            .url("localhost:3200")
            .page.main()
            client.waitForElementVisible(".download-url-input", 5000)
            .pause(5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3200/test-specs/1.json")
            .click("button.download-url-button")
            .pause(1000)

            informationContainer = mainPage.section.informationContainer
            
            done()
        })

        it("renders section", function (client) {
            mainPage.expect.section("@informationContainer").to.be.visible.before(5000)

            client.end()
        })

        it("renders content", function (client) {
            informationContainer.waitForElementVisible("@title", 5000)
                .assert.containsText("@title", "Swagger Petstore")
                .assert.containsText("@version", "1.0.0")
                .assert.containsText("@baseUrl", "[ Base URL: localhost:3204/ ]")
                .assert.attributeEquals("@mainUrl", "href", "http://localhost:3200/test-specs/1.json")
                .assert.containsText("@mainUrlContent", "http://localhost:3200/test-specs/1.json")
                .assert.containsText("@description", "This is a sample server Petstore server. You can find out more about Swagger at http://swagger.io or on irc.freenode.net, #swagger. For this sample, you can use the api key special-key to test the authorization filters.")
                .assert.attributeEquals("@swaggerUrl", "href", "http://swagger.io/")
                .assert.attributeEquals("@swaggerircUrl", "href", "http://swagger.io/irc/")
                .assert.attributeEquals("@termsLink", "href", "http://swagger.io/terms/")
                .assert.containsText("@termsLink", "Terms of service")
                .assert.attributeEquals("@contactDevLink", "href", "mailto:apiteam@swagger.io")
                .assert.containsText("@contactDevLink", "Contact the developer")
                .assert.attributeEquals("@contactDevLink", "href", "mailto:apiteam@swagger.io")
                .assert.containsText("@contactDevLink", "Contact the developer")
                .assert.attributeEquals("@aboutSwaggerLink", "href", "http://swagger.io/")
                .assert.containsText("@aboutSwaggerLink", "Find out more about Swagger")
                
            client.end()
        })
    })

    describe("render pet api container", function () {
        let mainPage
        let apiWrapper
        beforeEach(function (client, done) {
            mainPage = client
                .url("localhost:3200")
                .page.main()

            client.waitForElementVisible(".download-url-input", 5000)
                .pause(5000)
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
            mainPage.expect.section("@apiWrapper").to.be.visible.before(10000)
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
            apiWrapper.waitForElementVisible("@petOperationPostContainer", 10000)
                .assert.containsText("@petOperationPostTitle", "/pet")
                .click("@petOperationPostCollpase")
                .waitForElementVisible("@petOperationPostCollapseContainer", 5000)
                .click("@petOperationPostTryBtn")
                .waitForElementVisible("@petOperationPostTryText", 1000)
                .waitForElementVisible("@petOperationPostExecuteBtn", 1000)
                .click("@petOperationPostTryBtn")
                .assert.cssClassNotPresent("@petOperationPostTryBtn", "cancel")

            client.end()
        })

        it("Testing post /pet api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@petOperationPostContainer", 5000)
                .click("@petOperationPostCollpase")
                .waitForElementVisible("@petOperationPostCollapseContainer", 5000)
                .click("@petOperationPostTryBtn")
                .waitForElementVisible("@petOperationPostExecuteBtn", 1000)
                .click("@petOperationPostExecuteBtn")
                .waitForElementVisible("@petOperationPostMockCategoryID", 2000)
                .assert.containsText("@petOperationPostMockCategoryID", "0")
                .assert.containsText("@petOperationPostMockCategoryName", "\"string\"")
                .assert.containsText("@petOperationPostMockName", "\"doggie\"")
                .assert.containsText("@petOperationPostTagID", "0")
                .assert.containsText("@petOperationPostTagName", "\"string\"")
                .assert.containsText("@petOperationPostStatus", "\"available\"")
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
        it("Testing put /pet api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@petOperationPutContainer", 5000)
                .click("@petOperationPutCollpase")
                .waitForElementVisible("@petOperationPutCollapseContainer", 3000)
                .click("@petOperationPutTryBtn")
                .waitForElementVisible("@petOperationPutExecuteBtn", 1000)
                .click("@petOperationPutExecuteBtn")
                .waitForElementVisible("@petOperationPutMockCategoryID")
                .assert.containsText("@petOperationPutMockCategoryID", "0")
                .assert.containsText("@petOperationPutMockCategoryName", "\"string\"")
                .assert.containsText("@petOperationPutMockName", "\"doggie\"")
                .assert.containsText("@petOperationPutTagID", "0")
                .assert.containsText("@petOperationPutTagName", "\"string\"")
                .assert.containsText("@petOperationPutStatus", "\"available\"")
                .click("@petOperationPutTryBtn")
                .assert.cssClassNotPresent("@petOperationPutTryBtn", "Cancel")

            client.end()
        })

        it("render get by tag /pet api container", function (client) {
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

        it("Testing get by tag /pet api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@petOperationGetByTagContainer", 5000)
                .click("@petOperationGetByTagCollpase")
                .waitForElementVisible("@petOperationGetByTagCollapseContainer", 3000)
                .click("@petOperationGetByTagTryBtn")
                .waitForElementVisible("@petOperationGetByTagExecuteBtn", 1000)
                .click("@petOperationGetByTagExecuteBtn")
                .waitForElementVisible("@petOperationGetByTagMockCategoryID")
                .assert.containsText("@petOperationGetByTagMockCategoryID", "0")
                .assert.containsText("@petOperationGetByTagMockCategoryName", "\"string\"")
                .assert.containsText("@petOperationGetByTagMockName", "\"doggie\"")
                .assert.containsText("@petOperationGetByTagTagID", "0")
                .assert.containsText("@petOperationGetByTagTagName", "\"string\"")
                .assert.containsText("@petOperationGetByTagStatus", "\"available\"")
                .click("@petOperationGetByTagTryBtn")
                .assert.cssClassNotPresent("@petOperationGetByTagTryBtn", "cancel")

            client.end()
        })

        it("render delete /pet api container", function (client) {
            apiWrapper.waitForElementVisible("@petOperationDeleteContainer")
                .assert.containsText("@petOperationDeleteTitle", "/pet/{petId}")
                .click("@petOperationDeleteCollpase")
                .waitForElementVisible("@petOperationDeleteCollapseContainer", 3000)
                .click("@petOperationDeleteTryBtn")
                .waitForElementVisible("@petOperationDeleteExecuteBtn", 1000)
                .click("@petOperationDeleteTryBtn")
                .assert.cssClassNotPresent("@petOperationDeleteTryBtn", "cancel")
                
            client.end()
        })
        it("Testing delete /pet api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@petOperationDeleteContainer", 3000)
                .click("@petOperationDeleteCollpase")
                .waitForElementVisible("@petOperationDeleteCollapseContainer", 3000)
                .click("@petOperationDeleteTryBtn")
                .waitForElementVisible("@petOperationDeleteExecuteBtn", 1000)
                .click("@petOperationDeleteExecuteBtn")
                .waitForElementVisible("@petOperationDeleteMockCategoryID")
                .assert.containsText("@petOperationDeleteMockCategoryID", "0")
                .assert.containsText("@petOperationDeleteMockCategoryName", "\"string\"")
                .assert.containsText("@petOperationDeleteMockName", "\"doggie\"")
                .assert.containsText("@petOperationDeleteTagID", "0")
                .assert.containsText("@petOperationDeleteTagName", "\"string\"")
                .assert.containsText("@petOperationDeleteStatus", "\"available\"")
                .click("@petOperationDeleteTryBtn")
                .assert.cssClassNotPresent("@petOperationDeleteTryBtn", "cancel")

            client.end()
        })
    })
    describe("render store api container", function(){
        let mainPage
        let apiWrapper
        beforeEach( function(client, done){
            mainPage = client
                .url("localhost:3200")
                .page.main()

            client.waitForElementVisible(".download-url-input", 5000)
                .pause(3000)
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
    describe("render user api container", function(){
        let mainPage
        let apiWrapper
        beforeEach( function(client, done){
            mainPage = client
                .url("localhost:3200")
                .page.main()

            client.waitForElementVisible(".download-url-input", 5000)
                .pause(5000)
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
        it("test rendered user container", function(client){
            apiWrapper.waitForElementVisible("@userAPIWrapper", 5000)
                .expect.element("@userAPIWrapper").to.be.visible

        client.end()
        })
        it("callapse user wrapper", function(client){
            apiWrapper.waitForElementVisible("@userAPIWrapper", 5000)
                .click("@userAPIWrapperBar")
                .assert.cssClassNotPresent("@userAPIWrapper", "is-open")

            client.end()
        })
        it("render put /user/{username} api container", function (client) {
            apiWrapper.waitForElementVisible("@userOperationPutContainer", 5000)
                .assert.containsText("@userOperationPutTitle", "/user/{username}")
                .click("@userOperationPutCollpase")
                .waitForElementVisible("@userOperationPutCollapseContainer", 3000)
                .click("@userOperationPutTryBtn")
                .waitForElementVisible("@userOperationPutExecuteBtn", 1000)
                .click("@userOperationPutTryBtn")
                .assert.cssClassNotPresent("@userOperationPutTryBtn", "cancel")
                
            client.end()
        })
        it("Test put /user/{username} api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@userOperationPutContainer", 5000)
                .assert.containsText("@userOperationPutTitle", "/user/{username}")
                .click("@userOperationPutCollpase")
                .waitForElementVisible("@userOperationPutCollapseContainer", 3000)
                .click("@userOperationPutTryBtn")
                .waitForElementVisible("@userOperationPutParameter")
                .setValue("@userOperationPutParameter", "123")
                .waitForElementVisible("@userOperationPutExecuteBtn", 1000)
                .click("userOperationPutExecuteBtn")
                .waitForElementVisible("@userOperationPutResponseHeader")
                .assert.containsText("@userOperationPutResponseHeader", "content-type: application/xml")
                .click("@userOperationPutTryBtn")
                .assert.cssClassNotPresent("@userOperationPutTryBtn", "cancel")
                
            client.end()
        })
        it("render delete /user/{username} api container", function (client) {
            apiWrapper.waitForElementVisible("@userOperationDeleteContainer", 5000)
                .assert.containsText("@userOperationDeleteTitle", "/user/{username}")
                .click("@userOperationDeleteCollpase")
                .waitForElementVisible("@userOperationDeleteCollapseContainer", 3000)
                .click("@userOperationDeleteTryBtn")
                .waitForElementVisible("@userOperationDeleteExecuteBtn", 1000)
                .click("@userOperationDeleteTryBtn")
                .assert.cssClassNotPresent("@userOperationDeleteTryBtn", "cancel")
                
            client.end()
        })
        it("Test delete /user/{username} api Mock data", function (client) {
            apiWrapper.waitForElementVisible("@userOperationDeleteContainer", 5000)
                .assert.containsText("@userOperationDeleteTitle", "/user/{username}")
                .click("@userOperationDeleteCollpase")
                .waitForElementVisible("@userOperationDeleteCollapseContainer", 3000)
                .click("@userOperationDeleteTryBtn")
                .waitForElementVisible("@userOperationDeleteParameter")
                .setValue("@userOperationDeleteParameter", "123")
                .waitForElementVisible("@userOperationDeleteExecuteBtn", 1000)
                .click("userOperationDeleteExecuteBtn")
                .waitForElementVisible("@userOperationDeleteResponseHeader")
                .assert.containsText("@userOperationDeleteResponseHeader", "content-type: application/xml")
                .click("@userOperationDeleteTryBtn")
                .assert.cssClassNotPresent("@userOperationDeleteTryBtn", "cancel")
                
            client.end()
        })
    })
    describe("Render Model Wrapper", function () {
        let modelWrapper

        beforeEach(function (client, done) {
            mainPage = client
                .url("localhost:3200")
                .page.main()
            client.waitForElementVisible(".download-url-input", 5000)
                .pause(5000)
                .clearValue(".download-url-input")
                .setValue(".download-url-input", "http://localhost:3200/test-specs/1.json")
                .click("button.download-url-button")
                .pause(1000)

            modelWrapper = mainPage.section.modelWrapper

            done()
        })
        afterEach(function (client, done){
            done()
        })
        it("Render model wrapper", function(client){
            mainPage.expect.section("@modelWrapper").to.be.visible.before(5000)

            client.end()
        })

        it("Render model wrapper collapse", function(client){
            modelWrapper.waitForElementVisible("@modelContainer", 5000)
                .click("@modelCollapse")
                .assert.cssClassNotPresent("@modelContainer", "is-open")

            client.end()
        })

        it("Testing order model", function(client){
            modelWrapper.waitForElementVisible("@orderModel")
                .click("@orderModelCallapse")
                .assert.cssClassNotPresent("@orderModelCallapse", "callapsed")
            
            client.end()
        })

        it("Testing category model", function(client){
            modelWrapper.waitForElementVisible("@categoryModel")
                .click("@categoryModelCallapse")
                .assert.cssClassNotPresent("@categoryModelCallapse", "callapsed")
            
            client.end()
        })
        it("Testing user model", function(client){
            modelWrapper.waitForElementVisible("@userModel")
                .click("@userModelCallapse")
                .assert.cssClassNotPresent("@userModelCallapse", "callapsed")
            
            client.end()
        })
        it("Testing tag model", function(client){
            modelWrapper.waitForElementVisible("@tagModel")
                .click("@tagModelCallapse")
                .assert.cssClassNotPresent("@tagModelCallapse", "callapsed")
            
            client.end()
        })
        it("Testing pet model", function(client){
            modelWrapper.waitForElementVisible("@petModel")
                .click("@petModelCallapse")
                .assert.cssClassNotPresent("@petModelCallapse", "callapsed")
            
            client.end()
        })
        it("Testing apiResponse model", function(client){
            modelWrapper.waitForElementVisible("@apiResponseModel")
                .click("@apiResponseModelCallapse")
                .assert.cssClassNotPresent("@apiResponseModelCallapse", "callapsed")
            
            client.end()
        })
    })
})
