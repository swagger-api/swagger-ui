/**
 * @prettier
 */

describe("Empty JSON Schema 2020-12", () => {
  it("should render as schema of type `any`", () => {
    cy.visit("/?url=/documents/features/json-schema-2020-12-empty-schema.yaml")

    cy.get(".json-schema-2020-12__title").should("contain", "Test")
    cy.get(".json-schema-2020-12__attribute").should("contain", "any")
  })
})
