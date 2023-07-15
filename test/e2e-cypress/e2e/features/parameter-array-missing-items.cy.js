describe("Parameter - Invalid definition with missing array 'items' (#7375)", () => {
  it("should render gracefully with fallback to default value", () => {
    cy.visit("/?url=/documents/features/parameter-array-missing-items.yaml")
      .get("#operations-default-get_example1")
      .click()
      .get("tbody > tr > .parameters-col_description textarea")
      .should("exist")
      .should("contains.text", "{}")
  })
})
