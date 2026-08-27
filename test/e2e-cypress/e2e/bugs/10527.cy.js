describe("#10527: External links to swagger-ui anchors don't work", () => {
  const baseUrl = "/?deepLinking=true&url=/documents/bugs/10527.yaml"

  it("should not rewrite a hash anchor that targets a Model panel id", () => {
    cy.visit(`${baseUrl}#model-Category`)
      // give the deep-linking parser a chance to run
      .get("#model-Category")
      .should("exist")
    cy.location().should((loc) => {
      expect(loc.hash).to.eq("#model-Category")
    })
  })

  it("should still expand a deep-link rooted at '/' for an operation", () => {
    cy.visit(`${baseUrl}#/pets/listPets`)
      .get("#operations-pets-listPets.is-open")
      .should("exist")
    cy.location().should((loc) => {
      expect(loc.hash).to.eq("#/pets/listPets")
    })
  })
})
