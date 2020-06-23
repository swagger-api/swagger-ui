describe("parameter example rendering", function () {
    describe("swagger 2.0", () => {
      beforeEach(function (client, done) {
        client
          .url("localhost:3230")
          .page.main()

        client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
          .clearValue(".download-url-input")
          .setValue(".download-url-input", "/test-specs/features/example.swagger.yaml")
          .click("button.download-url-button")
          .waitForElementVisible(".opblock", 10000)
          .click("#operations-default-put_one")
          .waitForElementVisible("#operations-default-put_one.is-open", 5000)

        done()
      })
      afterEach(function (client, done) {
        done()
      })
      it("reveals a string parameter's example when viewing that parameter", function (client) {
        client.waitForElementVisible(".opblock-tag-section", 10000)
          .assert.containsText(".opblock-summary-path span", "/one")
          .click(".opblock")
          .waitForElementVisible(".opblock.is-open", 5000)
          .pause(500)
          .assert.containsText(`tr[data-param-name="ValidParam"]`, `12345`)

        client.end()
      })

    })
    describe("openapi 3.0", () => {
      beforeEach(function (client, done) {
          client
            .url("localhost:3230")
            .page.main()

          client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
            .clearValue(".download-url-input")
            .setValue(".download-url-input", "/test-specs/features/example.openapi.yaml")
            .click("button.download-url-button")
            .waitForElementVisible(".opblock-summary-description", 10000)
            .click("#operations-agent-editAgent")
            .waitForElementVisible("#operations-agent-editAgent.is-open", 5000)

          done()
      })
      afterEach(function (client, done) {
          done()
      })
      it("reveals a string parameter's example when viewing that parameter", function (client) {
          it("should respect a primitive example value", function(client) {
            client
              .assert.value(
                `div.parameters-container > div > table > tbody > tr > td.col.parameters-col_description > input[type="text"]`,
                `12345`
              )

            client.end()
          })
      })
    })
})
