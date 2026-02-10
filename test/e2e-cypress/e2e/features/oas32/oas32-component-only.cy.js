/**
 * @prettier
 */

describe("OpenAPI 3.2.0 - Component-Only Specification", () => {
  const baseUrl = "/?url=/documents/oas32/component-only.yaml"

  it("should render component-only spec with all fields", () => {
    cy.visit(baseUrl)
      .get(".version-pragma__message--missing")
      .should("not.exist")
      .get(".information-container")
      .should("exist")
      .find(".title")
      .should("contain", "Component-Only Specification")
      .get(".information-container .description")
      .should("contain", "valid OAS 3.2.0 specification")
      .get(".opblock-tag-section")
      .should("not.exist")
  })
})
