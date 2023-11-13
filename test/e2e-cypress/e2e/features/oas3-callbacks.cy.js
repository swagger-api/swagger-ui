/**
 * Related to // https://github.com/swagger-api/swagger-ui/issues/9222.
 */

describe("OpenAPI 3.0 Callbacks", () => {
  it("should render all defined callbacks", () => {
    cy.visit(
      "/?url=/documents/features/oas3-callbacks.yaml"
    )
      .get("#operations-Device-register")
      .click()
      .get(".opblock-section-header .tab-item.false")
      .click()
      .get("#operations-callbacks-callbackOne")
      .should("be.visible")
      .get("#operations-callbacks-callbackTwo")
      .should("be.visible")
  })
})
