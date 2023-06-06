describe("Render Webhooks Component", () => {
  describe("OpenAPI 3.1.x", () => {
    const baseUrl = "/?url=/documents/features/webhooks-openAPI31.yaml"
    it("should render a heading", () => {
      cy.visit(baseUrl)
        .get(".webhooks")
        .should("exist")
        .should("contains.text", "Webhooks")
    })
    it("should render an operation component", () => {
      cy.visit(baseUrl)
        .get(".webhooks #operations-webhooks-postnewPet > .opblock-summary")
        .should("exist")
        .should("contains.text", "POST")
        .should("contains.text", "newPet")
    })
  })
  describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/webhooks-openAPI31.yaml"
    it("should render nothing", () => {
      cy.visit(baseUrl)
        .get(".webhooks")
        .should("not.exist")
    })
  })
})
