describe("OAuth2 Bearer flow", () => {
  beforeEach(() => {
    const staticResponse = {
      statusCode: 200,
      body: {
        name: "not a random secret for test",
      }
    }
    cy.intercept("GET", "/get*", staticResponse).as(
      "tokenRequest"
    )
  })

  it("should be focused on input field with aria-label", () => {
    cy.visit(
      "/?url=/documents/features/auth-bearer-flow.yaml"
    )
      .get("button.authorize")
      .click()
    cy.focused()
      .should("have.attr", "aria-label").and("eq", "auth-bearer-value")
  })
  it("should make a header request with proper sample cURL header", () => {
    cy.visit(
      "/?url=/documents/features/auth-bearer-flow.yaml"
    )
      .get("button.authorize")
      .click()
      .get("section > input")
      .type("secret_token")
      .get(".auth-btn-wrapper > .authorize")
      .click()
      .get("button.close-modal")
      .click()
      // Try-it-out
      .get("#operations-default-get_get")
      .click()
      .get(".btn.try-out__btn")
      .click()
      .get(".btn.execute")
      .click()
    cy.wait("@tokenRequest")
      .its("request")
      .its("headers")
      .its("authorization")
      .should("equal", "Bearer secret_token")
      .get(".curl")
      .contains("Authorization: Bearer secret_token")
      .should("be.visible")
  })
})
