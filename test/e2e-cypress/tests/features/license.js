describe("Render License", () => {
  it("should render License URL from Swagger2 definition", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI2.yaml"
    cy.visit(baseUrl)
      .get(".info__license")
      .should("exist")
      .should("contains.text", "Apache 2.0")
      .should("not.contains.text", "SPDX License")
      .get(".info__license__identifier")
      .should("not.exist")
  })
  it("should render License URL from OpenAPI 3.0 definition", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI30.yaml"
    cy.visit(baseUrl)
      .get(".info__license__url")
      .should("exist")
      .should("contains.text", "Apache 2.0")
      .should("not.contains.text", "SPDX License")
      .get(".info__license__identifier")
      .should("not.exist")
   })
  describe("should render License from OpenAPI 3.1 definition", () => { 
    it("should render only URL", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-url.yaml"
      cy.visit(baseUrl)
        .get(".info__license__url")
        .should("exist")
        .should("contains.text", "Apache 2.0")
        .should("not.contains.text", "SPDX License")
        .get(".info__license__identifier")
        .should("not.exist")
     })
    it("should render only SPDX", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-identifier.yaml"
      cy.visit(baseUrl)
        .get(".info__license__identifier")
        .should("exist")
        .should("contains.text", "Apache-2.0")
        .should("contains.text", "SPDX License")
        .get(".info__license__url")
        .should("not.exist")
     })
    it("should render nothing if both URL & SPDX exists", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-error-both-identifier-and-url.yaml"
      cy.visit(baseUrl)
        .get(".info__license__identifier")
        .should("not.exist")
        .get(".info__license__url")
        .should("not.exist")
     })
  })
})
