describe("OAuth2 Password flow", function() {
  beforeEach(() => {
    cy.server()
    cy.route({
      url: "**/oauth/*",
      method: "POST"
    }).as("tokenRequest")
  })

  it("should make a password flow Authorization header request", () => {
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

    cy.get("@tokenRequest")
      .its("request")
      .its("body")
      .should("include", "grant_type=password")
      .should("include", "username=swagger")
      .should("include", "password=password")
      .should("not.include", "client_id")
      .should("not.include", "client_secret")

    cy.get("@tokenRequest")
      .its("request")
      .its("headers")
      .its("authorization")
      .should("equal", "Basic YXBwbGljYXRpb246c2VjcmV0")

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })

  it("should make a Password flow request-body request", () => {
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

    cy.get("@tokenRequest")
      .its("request")
      .its("body")
      .should("include", "grant_type=password")
      .should("include", "username=swagger")
      .should("include", "password=password")
      .should("include", "client_id=application")
      .should("include", "client_secret=secret")

    cy.get("@tokenRequest")
      .its("request")
      .its("headers")
      .should("not.have.property", "authorization")

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
})