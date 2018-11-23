describe("OAuth2 Password flow", function() {
  it("should make an authenticated password request-body request", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".btn.authorize")
      .click()

      .get("#oauth_username")
      .type("swagger")

      .get("#oauth_password")
      .type("password")

      .get("#password_type")
      .select("request-body")

      .get("#client_id")
      .clear()
      .type("application")

      .get("#client_secret")
      .clear()
      .type("secret")

      .get("div.modal-ux-content > div:nth-child(1) > div > div:nth-child(2) > div > div.auth-btn-wrapper > button.btn.modal-btn.auth.authorize.button")
      .click()

      .get("button.close-modal")
      .click()

      .get("#operations-default-get_password")
      .click()

      .get(".btn.try-out__btn")
      .click()

      .get(".btn.execute")
      .click()

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
  it("should make an authenticated password basic request", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".btn.authorize")
      .click()

      .get("#oauth_username")
      .type("swagger")

      .get("#oauth_password")
      .type("password")

      .get("#password_type")
      .select("basic")

      // .get("#client_id")
      // .clear()
      // .type("application")

      // .get("#client_secret")
      // .clear()
      // .type("secret")

      .get("div.modal-ux-content > div:nth-child(1) > div > div:nth-child(2) > div > div.auth-btn-wrapper > button.btn.modal-btn.auth.authorize.button")
      .click()

      .get("button.close-modal")
      .click()

      .get("#operations-default-get_password")
      .click()

      .get(".btn.try-out__btn")
      .click()

      .get(".btn.execute")
      .click()

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
  it("should make an authenticated password query request", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".btn.authorize")
      .click()

      .get("#oauth_username")
      .type("swagger")

      .get("#oauth_password")
      .type("password")

      .get("#password_type")
      .select("query")

      .get("#client_id")
      .clear()
      .type("application")

      .get("#client_secret")
      .clear()
      .type("secret")

      .get("div.modal-ux-content > div:nth-child(1) > div > div:nth-child(2) > div > div.auth-btn-wrapper > button.btn.modal-btn.auth.authorize.button")
      .click()

      .get("button.close-modal")
      .click()

      .get("#operations-default-get_password")
      .click()

      .get(".btn.try-out__btn")
      .click()

      .get(".btn.execute")
      .click()

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
})