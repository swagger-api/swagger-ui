/**
 * @prettier
 */

describe("OpenAPI 3.1.0 schema expansion", () => {
  it("should expand to the default expansion level", () => {
    cy.visit(
      "/?url=/documents/features/oas31-schema-expansion.yaml&defaultModelsExpandDepth=3&showExtensions=true"
    )

    cy.get(".json-schema-2020-12-property").contains("prop2").should("exist")
    cy.get(".json-schema-2020-12-property")
      .contains("prop3")
      .should("not.exist")

    cy.get(".json-schema-2020-12-keyword--xml")
      .contains("x-extension")
      .should("exist")
    cy.get(".json-schema-2020-12-keyword--xml")
      .contains("prop1")
      .should("not.exist")
  })

  it("should deeply expand nested collapsed keywords", () => {
    cy.visit(
      "/?url=/documents/features/oas31-schema-expansion.yaml&showExtensions=true"
    )

    cy.get(".json-schema-2020-12-expand-deep-button").click()
    cy.get(".json-schema-2020-12-keyword--xml")
      .contains("prop4")
      .should("exist")

    cy.get(".json-schema-2020-12-keyword--xml").contains("prop1").click()
    cy.get(".json-schema-2020-12-keyword--xml")
      .contains("prop4")
      .should("not.exist")

    cy.get(".json-schema-2020-12-keyword--xml").contains("XML").click()
    cy.get(
      ".json-schema-2020-12-keyword--xml .json-schema-2020-12-expand-deep-button"
    )
      .first()
      .click()
    cy.get(".json-schema-2020-12-keyword--xml")
      .contains("prop4")
      .should("exist")
  })
})
