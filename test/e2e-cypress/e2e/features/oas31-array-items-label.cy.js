/**
 * @prettier
 */
describe("OpenAPI 3.1 array items label", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas31-array-items-label.yaml")
    cy.get(".models").click()
    cy.get(".json-schema-2020-12").contains("UserList").click()
    cy.get(".json-schema-2020-12-accordion").contains("users").click()
  })

  it("should display the referenced schema name instead of 'Items' for array items", () => {
    cy.get(".json-schema-2020-12-keyword--items")
      .find(".json-schema-2020-12-keyword__name--primary")
      .should("have.text", "User")
  })

  it("should not display the generic 'Items' label when items is a $ref", () => {
    cy.get(".json-schema-2020-12-keyword--items")
      .find(".json-schema-2020-12-keyword__name--primary")
      .should("not.have.text", "Items")
  })
})
