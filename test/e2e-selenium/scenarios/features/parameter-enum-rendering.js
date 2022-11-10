describe("parameter enum rendering", function () {
    describe("swagger 2.0", () => {
      beforeEach(function (client, done) {
        client
          .url("localhost:3230")
          .waitForElementVisible(".download-url-input", 10000)
          .pause(1000)
          .clearValue(".download-url-input")
          .setValue(".download-url-input", "http://localhost:3230/test-specs/features/parameter-enum-rendering.swagger.yaml")
          .click("button.download-url-button")
          .pause(1000)

        done()
      })
      afterEach(function (client, done) {
        done()
      })
      it("reveals a string parameter's enums and defaults when viewing that parameter", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
        .assert.containsText(".opblock-summary-path span", "/report")
        .click(".opblock")
        .waitForElementVisible(".opblock.is-open", 5000)
        .pause(500)
        .assert.containsText("div.parameter__enum", "today, yesterday, lastweek")
        .assert.containsText("div.parameter__default", "today")

        client.end()
      })
    })
    describe("openapi 3.0", () => {
      beforeEach(function (client, done) {
          client
            .url("localhost:3230")
            .waitForElementVisible(".download-url-input", 10000)
            .pause(1000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "http://localhost:3230/test-specs/features/parameter-enum-rendering.openapi.yaml")
            .click("button.download-url-button")
            .pause(1000)

          done()
      })
      afterEach(function (client, done) {
          done()
      })
      it("reveals a string parameter's enums and defaults when viewing that parameter", function (client) {
          client.waitForElementVisible(".opblock-tag-section", 10000)
              .assert.containsText(".opblock-summary-path span", "/report")
              .click(".opblock")
              .waitForElementVisible(".opblock.is-open", 5000)
              .pause(500)
              .assert.containsText("div.parameter__enum", "today, yesterday, lastweek")
              .assert.containsText("div.parameter__default", "today")

          client.end()
      })
    })
})
