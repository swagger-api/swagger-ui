/**
 * @prettier
 */
describe("resolveSubtreeOnExpand disabled", () => {
  it("renders a schema model and its properties when expanded", () => {
    cy.visit(
      "/?url=/documents/features/models.swagger.yaml&resolveSubtreeOnExpand=false"
    )
      .get("#model-Pet .model-box .model-box-control")
      .click()
      .get("#model-Pet .model-box .model .inner-object")
      .should("exist")

    cy.get("#model-Pet").contains("tr.property-row td", "name").should("exist")
    cy.get("#model-Pet")
      .contains("tr.property-row td", "category")
      .should("exist")
    cy.get("#model-Pet").contains("Category").should("exist")
  })
})
