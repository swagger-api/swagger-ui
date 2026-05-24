/**
 * @prettier
 */

describe("JSON Schema 2020-12 uniqueItems keyword", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/json-schema-2020-12-unique-items.yaml")
  })

  it("should render `unique` label", () => {
    cy.contains("UniqueItems")
      .siblings("span")
      .contains("unique")
      .should("exist")
  })

  it("should render `unique items` label with range constraints", () => {
    cy.contains("UniqueItemsAndRangeConstraint")
      .siblings("span")
      .contains("[1, 5] unique items")
      .should("exist")
  })
})
