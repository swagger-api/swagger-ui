describe("OAuth2 Application flow", function() {
  beforeEach(() => {
    cy.server()
    cy.route({
      url: "**/oauth/*",
      method: "POST"
    }).as("tokenRequest")
  })

  // https://github.com/swagger-api/swagger-ui/issues/6395
  it("should have first authorization input autofocused", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".btn.authorize")
      .click()

    cy.focused()
      .should("have.id", "oauth_username")
  })

  it("should make an application flow Authorization header request", () => {
    cy
      .visit("/?url=http://localhost:3231/swagger.yaml")
      .get(".btn.authorize")
      .click()

      .get("div.modal-ux-content > div:nth-child(2)").within(() => {
        cy.get("#client_id")
          .clear()
          .type("confidentialApplication")

          .get("#client_secret")
          .clear()
          .type("topSecret")

          .get("button.btn.modal-btn.auth.authorize.button")
          .click()
      })

    cy.get("button.close-modal")
      .click()

      .get("#operations-default-get_application")
      .click()

      .get(".btn.try-out__btn")
      .click()

      .get(".btn.execute")
      .click()

    cy.get("@tokenRequest")
      .its("request")
      .its("body")
      .should("equal", "grant_type=client_credentials")

    cy.get("@tokenRequest")
      .its("request")
      .its("headers")
      .its("authorization")
      .should("equal", "Basic Y29uZmlkZW50aWFsQXBwbGljYXRpb246dG9wU2VjcmV0")

      .get(".live-responses-table .response-col_status")
      .contains("200")
  })
})
