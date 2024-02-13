/**
 * @prettier
 */

describe("defaultModelExpandDepth for JSON Schema 2020-12 keywords", () => {
  it("should expand schemas", () => {
    cy.visit("/pages/json-schema-2020-12-default-model-expand-depth/").then(
      () => {
        cy.get(".json-schema-2020-12-accordion")
          .find(".json-schema-2020-12-accordion__icon--collapsed")
          .should("not.exist")
        cy.contains("anyOf1-p1-p2-p1").should("exist")
        cy.contains("oneOf1-p1-p2-p1").should("exist")
        cy.contains("Prefix items").should("exist")
        cy.contains("exampleDef").should("exist")
        cy.contains("core").should("exist")
      }
    )
  })
})
