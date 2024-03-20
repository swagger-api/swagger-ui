/**
 * @prettier
 */

describe("OpenAPI 3.1.0 schema title", () => {
  it("should render a correct title", () => {
    cy.visit("/?url=/documents/features/oas31-schema-title.yaml")
      .get(".json-schema-2020-12__title")
      .eq(0)
      .contains("My Pet")
      .should("exist")
      .get(".json-schema-2020-12__title")
      .eq(1)
      .contains("My Pets")
      .should("exist")
      .get(".json-schema-2020-12__title")
      .eq(2)
      .contains("Error")
      .should("exist")
  })
})
