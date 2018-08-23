describe("feature: Swagger 2 allowEmptyValue", function () {
  beforeEach(function (client, done) {
    client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "/test-specs/features/allow-empty-value.swagger.yaml")
      .click("button.download-url-button")
      .waitForElementVisible(".opblock", 10000)

    done()
  })

  afterEach(function (client, done) {
    done()
  })

  describe("regular parameters", function () {
    it("should set and unset an integer value", function (client) {
      const inputSelector = `tr[data-param-name="int"] input`

      client // open try-it-out
        .click("#operations-default-get_regularParams")
        .waitForElementVisible("button.btn.try-out__btn", 5000)
        .click("button.btn.try-out__btn")
        .pause(200)

      client // set parameter, to ensure an initial value is set
        .setValue(inputSelector, "123")
        .click("button.btn.execute.opblock-control__btn")
        .pause(200)

      client // remove initial value, execute again
        .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
        .pause(200)
        .click("button.btn.execute.opblock-control__btn")
        .expect.element("textarea.curl").text
        .to.contain(`GET "http://localhost:3230/regularParams"`)
    })
    it("should set and unset a string value", function (client) {
      const inputSelector = `tr[data-param-name="str"] input`

      client // open try-it-out
        .click("#operations-default-get_regularParams")
        .waitForElementVisible("button.btn.try-out__btn", 5000)
        .click("button.btn.try-out__btn")
        .pause(200)

      client // set parameter, to ensure an initial value is set
        .setValue(inputSelector, "123")
        .click("button.btn.execute.opblock-control__btn")
        .pause(200)

      client // remove initial value, execute again
        .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
        .pause(200)
        .click("button.btn.execute.opblock-control__btn")
        .expect.element("textarea.curl").text
        .to.contain(`GET "http://localhost:3230/regularParams"`)
    })
    it("should set and unset a number value", function (client) {
      const inputSelector = `tr[data-param-name="num"] input`

      client // open try-it-out
        .click("#operations-default-get_regularParams")
        .waitForElementVisible("button.btn.try-out__btn", 5000)
        .click("button.btn.try-out__btn")
        .pause(200)

      client // set parameter, to ensure an initial value is set
        .setValue(inputSelector, "123")
        .click("button.btn.execute.opblock-control__btn")
        .pause(200)

      client // remove initial value, execute again
        .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
        .pause(200)
        .click("button.btn.execute.opblock-control__btn")
        .expect.element("textarea.curl").text
        .to.contain(`GET "http://localhost:3230/regularParams"`)
    })
    it("should set and unset a boolean value", function (client) {
      const inputSelector = `tr[data-param-name="bool"] select`

      client // open try-it-out
        .click("#operations-default-get_regularParams")
        .waitForElementVisible("button.btn.try-out__btn", 5000)
        .click("button.btn.try-out__btn")
        .pause(200)

      client // set parameter, to ensure an initial value is set
        .click(`${inputSelector} [value="true"]`)
        .click("button.btn.execute.opblock-control__btn")
        .pause(200)

      client // remove initial value, execute again
        .click(`${inputSelector} [value=""]`)
        .pause(200)
        .click("button.btn.execute.opblock-control__btn")
        .expect.element("textarea.curl").text
        .to.contain(`GET "http://localhost:3230/regularParams"`)
    })
    it("should set and unset an array value", function (client) {
      const inputSelector = `tr[data-param-name="arr"]`

      client // open try-it-out
        .click("#operations-default-get_regularParams")
        .waitForElementVisible("button.btn.try-out__btn", 5000)
        .click("button.btn.try-out__btn")
        .pause(200)

      client // set parameter, to ensure an initial value is set
        .click(`${inputSelector} .json-schema-form-item-add`)
        .setValue(`${inputSelector} input`, "asdf")
        .click("button.btn.execute.opblock-control__btn")
        .pause(200)

      client // remove initial value, execute again
        .click(`${inputSelector} .json-schema-form-item-remove`)
        .pause(200)
        .click("button.btn.execute.opblock-control__btn")
        .expect.element("textarea.curl").text
        .to.contain(`GET "http://localhost:3230/regularParams"`)
    })
  })

  describe("allowEmptyValue parameters", function () {
    describe("normal behavior", function () {
      it("should set and unset an integer value", function (client) {
        const inputSelector = `tr[data-param-name="int"] input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(200)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams"`)
      })
      it("should set and unset a string value", function (client) {
        const inputSelector = `tr[data-param-name="str"] input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(200)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams"`)
      })
      it("should set and unset a number value", function (client) {
        const inputSelector = `tr[data-param-name="num"] input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(200)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams"`)
      })
      it("should set and unset a boolean value", function (client) {
        const inputSelector = `tr[data-param-name="bool"] select`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .click(`${inputSelector} [value="true"]`)
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .click(`${inputSelector} [value=""]`)
          .pause(200)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams"`)
      })
      it("should set and unset an array value", function (client) {
        const inputSelector = `tr[data-param-name="arr"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .click(`${inputSelector} .json-schema-form-item-add`)
          .setValue(`${inputSelector} input`, "asdf")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .click(`${inputSelector} .json-schema-form-item-remove`)
          .pause(200)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams"`)
      })
    })
    describe("send empty inital value behavior", function () {
      it("should send an empty integer value", function (client) {
        const paramSelector = `tr[data-param-name="int"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // tick "send empty value" box and execute
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?int="`)
      })
      it("should send an empty string value", function (client) {
        const paramSelector = `tr[data-param-name="str"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // tick "send empty value" box and execute
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?str="`)
      })
      it("should send an empty number value", function (client) {
        const paramSelector = `tr[data-param-name="num"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // tick "send empty value" box and execute
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?num="`)
      })
      it("should send an empty boolean value", function (client) {
        const paramSelector = `tr[data-param-name="bool"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // tick "send empty value" box and execute
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?bool="`)
      })
      it("should send an empty array value", function (client) {
        const paramSelector = `tr[data-param-name="arr"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // tick "send empty value" box and execute
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?arr="`)
      })
    })
    describe("modify and send empty behavior", function () {
      it("should set, unset and send an empty integer value", function (client) {
        const paramSelector = `tr[data-param-name="int"]`
        const inputSelector = `${paramSelector} input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, click "send empty", execute again, assert
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(400)
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?int="`)
      })
      it("should set, unset and send an empty string value", function (client) {
        const paramSelector = `tr[data-param-name="str"]`
        const inputSelector = `${paramSelector} input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, click "send empty", execute again, assert
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(400)
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?str="`)
      })
      it("should set, unset and send an empty number value", function (client) {
        const paramSelector = `tr[data-param-name="num"]`
        const inputSelector = `${paramSelector} input`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .setValue(inputSelector, "123")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, click "send empty", execute again, assert
          .setValue(inputSelector, "\u0008\u0008\u0008") // backspaces
          .pause(400)
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?num="`)
      })
      it("should set, unset and send an empty boolean value", function (client) {
        const paramSelector = `tr[data-param-name="bool"]`
        const inputSelector = `${paramSelector} select`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .click(`${inputSelector} option[value="true"]`)
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, click "send empty", execute again, assert
          .click(`${inputSelector} option[value=""]`)
          .pause(400)
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?bool="`)
      })
      it("should set, unset and send an empty array value", function (client) {
        const paramSelector = `tr[data-param-name="arr"]`

        client // open try-it-out
          .click("#operations-default-get_emptyValueParams")
          .waitForElementVisible("button.btn.try-out__btn", 5000)
          .click("button.btn.try-out__btn")
          .pause(200)

        client // set parameter, to ensure an initial value is set
          .click(`${paramSelector} .json-schema-form-item-add`)
          .setValue(`${paramSelector} input`, "asdf")
          .click("button.btn.execute.opblock-control__btn")
          .pause(200)

        client // remove initial value, execute again
          .click(`${paramSelector} .json-schema-form-item-remove`)
          .pause(400)
          .click(`${paramSelector} .parameter__empty_value_toggle input`)
          .click("button.btn.execute.opblock-control__btn")
          .expect.element("textarea.curl").text
          .to.contain(`GET "http://localhost:3230/emptyValueParams?arr="`)
      })
    })
  })
})
