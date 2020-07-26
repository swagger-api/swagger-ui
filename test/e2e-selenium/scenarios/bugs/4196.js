describe("bug #4196: HTTP basic auth credential retention", function () {
  let mainPage
  beforeEach(function (client, done) {
    mainPage = client
      .url("localhost:3230")
      .page.main()

    client.waitForElementVisible(".download-url-input:not([disabled])", 5000)
      .clearValue(".download-url-input")
      .setValue(".download-url-input", "http://localhost:3230/test-specs/bugs/4196.yaml")
      .click("button.download-url-button")

    done()
  })
  afterEach(function (client, done) {
    done()
  })
  it("should display the most recent auth data across modal close/opens", function (client) {
    client.waitForElementVisible(".opblock-tag-section", 10000)
      .click("button.btn.authorize") // Open modal
      .waitForElementVisible("section>input", 5000)
      .setValue("section>input", "aaa") // Set user
      .waitForElementVisible(`section>input[type="password"]`, 5000)
      .setValue(`section>input[type="password"]`, "aaa") // Set password
      .click(".auth-btn-wrapper button:nth-child(1)") // Click Authorize
      .assert.containsText("div.wrapper:nth-child(4)>code", "aaa")
      .click(".auth-btn-wrapper button:nth-child(2)") // Close modal
      .pause(50)
      .click("button.btn.authorize") // Open modal
      .pause(50)
      .click(".auth-btn-wrapper button:nth-child(1)") // Logout
      .waitForElementVisible("section>input", 5000)
      .setValue("section>input", "bbb") // Set user
      .waitForElementVisible(`section>input[type="password"]`, 5000)
      .setValue(`section>input[type="password"]`, "bbb") // Set password
      .click(".auth-btn-wrapper button:nth-child(1)") // Click Authorize
      .pause(1000)
      .assert.containsText("div.wrapper:nth-child(4)>code", "bbb")

    client.end()
  })
})
