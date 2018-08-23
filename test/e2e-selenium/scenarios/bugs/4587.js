describe("bug #4587: clearing header param values", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .pause(2000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4587.yaml")
      .click("button.download-url-button")
      .pause(1000)

    done()
  })

  afterEach(function (client, done) {
    done()
  })

  it("sets a required initial value based the first enum value", function (client) {
    client.waitForElementVisible(".opblock-tag-section", 10000)
    .click("#operations-sql-execSql")
    .waitForElementVisible(".opblock.is-open", 5000)
      .click("button.btn.try-out__btn")
      .setValue(`tr[data-param-name="x-irest-conn"] input`, "hi")
      .click("button.btn.execute")
      .waitForElementVisible(".request-url", 2000)
      .setValue(`tr[data-param-name="x-irest-conn"] input`, `\u0008\u0008\u0008`) // backspaces
      .pause(900)
      .click("button.btn.execute")
      .expect.element("textarea.curl").text
      .to.not.contain(`x-irest-conn`)
  })
})
