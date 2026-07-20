/**
 * @prettier
 */

describe("OpenAPI 3.2.0 - Version Detection", () => {
  const baseUrl = "/?url=/documents/oas32/oas32-features.yaml"

  it("should detect and render OAS 3.2.0 spec with all info fields", () => {
    cy.visit(baseUrl)
      .get(".information-container")
      .should("exist")
      .find(".title")
      .should("contain", "OAS 3.2.0 Basic Features")
      .get(".information-container .description")
      .should("contain", "basic features implemented for OpenAPI 3.2.0")
      .get(".information-container .info__summary")
      .should("contain", "Demonstrates basic OpenAPI 3.2.0 implementation")
      .get(".version-pragma__message--missing")
      .should("not.exist")
  })
})
