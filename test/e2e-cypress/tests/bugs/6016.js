describe("Entries should be valid property name", () => {
  it("should render a OAS3.0 definition that uses 'entries' as a property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas3.yaml")
      .get("#operations-tag-default")
      .should("exist")
  })
  it("should render a OAS2.0 definition that uses 'entries' as a property name", () => {
    cy.visit("/?url=/documents/bugs/6016-oas2.yaml")
      .get("#operations-default-post_pet")
      .should("exist")
  })
})
