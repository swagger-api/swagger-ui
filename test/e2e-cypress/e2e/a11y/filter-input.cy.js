describe("Filter input accessibility", () => {
  describe("with filter enabled", () => {
    it("should expose an accessible name via aria-label on the filter input", () => {
      cy.visit("/?url=/documents/petstore.swagger.yaml&filter=true")
        .get(".operation-filter-input")
        .should("exist")
        .should("have.attr", "aria-label", "Filter by tag")
    })

    it("should still render the visual placeholder for sighted users", () => {
      cy.visit("/?url=/documents/petstore.swagger.yaml&filter=true")
        .get(".operation-filter-input")
        .should("exist")
        .should("have.attr", "placeholder", "Filter by tag")
    })
  })
})
