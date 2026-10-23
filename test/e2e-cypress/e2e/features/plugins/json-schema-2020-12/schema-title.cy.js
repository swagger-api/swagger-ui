/**
 * @prettier
 */

describe("JSON Schema 2020-12 title keyword", () => {
  it("should render a correct title for schemas", () => {
    cy.visit("/?url=/documents/features/json-schema-2020-12-title.yaml")
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

  it("should render a title for schema properties", () => {
    cy.visit(
      "/?url=/documents/features/json-schema-2020-12-title.yaml&defaultModelsExpandDepth=2"
    )
      .get(".json-schema-2020-12-property")
      .contains(".json-schema-2020-12__title", "nickname")
      .contains("Pet nickname")
      .should("exist")
  })

  it("should not repeat a property title that matches the property name", () => {
    cy.visit(
      "/?url=/documents/features/json-schema-2020-12-title.yaml&defaultModelsExpandDepth=2"
    )
      .get(".json-schema-2020-12-property")
      .contains(".json-schema-2020-12__title", "color")
      .find(".json-schema-2020-12__title-secondary")
      .should("not.exist")
  })
})
