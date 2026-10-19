/**
 * @prettier
 */
describe("Filter: search by tag and path", () => {
  describe("petstore", () => {
    beforeEach(() => {
      cy.visit("/?url=/documents/petstore.swagger.yaml&filter=true")
    })

    it("filters by tag name case-insensitively", () => {
      cy.get(".operation-filter-input").type("STORE")
      cy.get(".opblock-tag").should("have.length", 1)
      cy.get(".opblock-tag").first().should("contain", "store")
    })

    it("filters operations by path", () => {
      cy.get(".operation-filter-input").type("findbystatus")
      cy.get(".opblock").should("have.length", 1)
      cy.get(".opblock-summary-path").should("contain", "/pet/findByStatus")
    })

    it("shows nothing when there is no match", () => {
      cy.get(".operation-filter-input").type("doesnotexist")
      cy.get(".opblock").should("not.exist")
    })
  })

  describe("virtualized definition", () => {
    it("finds and renders an operation initially outside the viewport", () => {
      cy.visit("/?url=/documents/perf/many-operations.yaml&filter=true")

      cy.get("#operations-perfTag24-perfOp24_22").should("not.exist")
      cy.get(".operation-filter-input").type("/perf/tag24/resource22")
      cy.get("#operations-perfTag24-perfOp24_22").should("exist")
    })
  })
})
