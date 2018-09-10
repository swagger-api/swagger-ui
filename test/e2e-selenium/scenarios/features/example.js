const dedent = require("dedent")

describe("feature: `example` field support", function () {

  describe("Swagger 2", function() {

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

    // Parameters
      // Supports complex root `example` values in Schema objects for bodies
      // Supports nested `example` values in Schema objects for bodies

    describe("primitive parameters", function() {
      it("should respect a primitive x-example value", function (client) {
        client
          .click("button.try-out__btn")
          .assert.value(
            `tr[data-param-name="ValidParam"] input[type="text"]`,
            `12345`
          )
      })
      it("should ignore a primitive example value", function (client) {
        client
          .click("button.try-out__btn")
          .assert.value(
            `tr[data-param-name="NotValidParam"] input[type="text"]`,
            ``
          )
      })
    })

    describe("object parameters", function() {
      it("should correctly consider property-level schema examples", function(client) {
        client.assert.containsText(`div[data-param-name="body"] pre`,
          dedent(`
            {
              "one": "hello!",
              "two": {
                "uno": "wow!",
                "dos": "hey there!"
              }
            }
          `)
        )
      })
      it("should correctly consider root schema-level schema examples", function(client) {
        client.assert.containsText(`div[data-param-name="body2"] pre`,
          dedent(`
            {
              "foo": "hey",
              "bar": 123
            }
          `)
        )
      })
      it("should correctly consider nested schema-level schema examples", function(client) {
        client.assert.containsText(`div[data-param-name="body3"] pre`,
          dedent(`
            {
              "one": {
                "uno": "woohoo!",
                "dos": "amazing!"
              }
            }
          `)
        )
      })
    })

    describe("responses", function() {
      it("should correctly consider schema-level examples", function (client) {
        client.assert.containsText(`tr.response[data-code="201"] pre`,
          dedent(`
            {
              "code": 201,
              "payload": [
                {
                  "id": 1,
                  "code": "AE2",
                  "name": "Yono"
                }
              ]
            }
          `)
        )
      })
      it("should correctly consider property-level examples", function (client) {
        client.assert.containsText(`tr.response[data-code="202"] pre`,
          dedent(`
            {
              "code": 202,
              "payload": [
                {
                  "id": 1,
                  "code": "AE2",
                  "name": "Yono"
                }
              ]
            }
          `)
        )
      })
    })
  })
  describe("OpenAPI 3.0", function() {
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

    describe("parameters", function() {
      it("should respect a primitive example value", function(client) {
        client
          .click("button.try-out__btn")
          .assert.value(
            `div.parameters-container > div > table > tbody > tr > td.col.parameters-col_description > input[type="text"]`,
            `12345`
          )
      })
    })

    describe("request bodies", function() {
      it("should correctly consider media type-level examples", function (client) {
        client
          .click(`select.content-type option[value="application/json_media-type-level"]`)
          .assert.containsText(`pre.body-param__example`,
            dedent(`
              {
                "code": "AE1",
                "name": "Andrew"
              }
            `)
          )
      })
      it("should correctly consider schema-level examples", function (client) {
        client
          .click(`select.content-type option[value="application/json_schema-level"]`)
          .assert.containsText(`pre.body-param__example`,
            dedent(`
              {
                "code": "AE1",
                "name": "Andrew"
              }
            `)
          )
      })
      it("should correctly consider property-level examples", function (client) {
        client
          .click(`select.content-type option[value="application/json_property-level"]`)
          .assert.containsText(`pre.body-param__example`,
            dedent(`
              {
                "code": "AE1",
                "name": "Andrew"
              }
            `)
          )
      })
    })
    describe("responses", function() {
      it("should correctly consider media type-level examples", function (client) {
        client.assert.containsText(`tr.response[data-code="200"] pre`,
          dedent(`
            {
              "code": 200,
              "payload": [
                {
                  "id": 1,
                  "code": "AE2",
                  "name": "Yono"
                }
              ]
            }
          `)
        )
      })
      it("should correctly consider schema-level examples", function (client) {
        client.assert.containsText(`tr.response[data-code="201"] pre`,
          dedent(`
            {
              "code": 201,
              "payload": [
                {
                  "id": 1,
                  "code": "AE2",
                  "name": "Yono"
                }
              ]
            }
          `)
        )
      })
      it("should correctly consider property-level examples", function (client) {
        client.assert.containsText(`tr.response[data-code="202"] pre`,
          dedent(`
            {
              "code": 202,
              "payload": [
                {
                  "id": 1,
                  "code": "AE2",
                  "name": "Yono"
                }
              ]
            }
          `)
        )
      })
    })
  })
})
