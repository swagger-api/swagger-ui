describe("a11y: API version label", () => {
  it("should render the API version stamp without a <pre> element (OpenAPI 3)", () => {
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .get(".info .title small")
      .first()
      .should("be.visible")
      .within(() => {
        cy.get("pre").should("not.exist")
        cy.get(".version").should("exist").and("not.match", "pre")
      })
  })

  it("should render the OAS version stamp without a <pre> element", () => {
    cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
      .get(".info .title small.version-stamp")
      .first()
      .should("be.visible")
      .within(() => {
        cy.get("pre").should("not.exist")
        cy.get(".version")
          .should("exist")
          .and("not.match", "pre")
          .and("contain.text", "OAS")
      })
  })
})
