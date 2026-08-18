/**
 * @prettier
 */

describe("JSON Schema 2020-12 complex keywords expansion", () => {
  it("should deeply expand all Schemas and complex keywords", () => {
    cy.visit("/pages/json-schema-2020-12-expansion/").then(() => {
      cy.get(".json-schema-2020-12-accordion")
        .find(".json-schema-2020-12-accordion__icon--collapsed")
        .should("not.exist")
      cy.contains("anyOf1-p1-p2-p1").should("exist")
      cy.contains("oneOf1-p1-p2-p1").should("exist")
      cy.contains("Prefix items").should("exist")
      cy.contains("exampleDef").should("exist")
      cy.contains("https://json-schema.org/draft/2020-12/vocab/core").should(
        "exist"
      )
    })
  })

  it("should collapse and expand accordion on initial render click", () => {
    cy.visit("/pages/json-schema-2020-12-expansion/").then(() => {
      cy.get(".json-schema-2020-12-accordion").should("exist")
      cy.contains("p1")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-accordion__icon--expanded")
        .should("exist")
      cy.contains("p1")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-accordion")
        .first()
        .click()
      cy.contains("p1")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-accordion__icon--collapsed")
        .should("exist")
      cy.contains("p1")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-accordion")
        .first()
        .click()
      cy.contains("p1")
        .closest(".json-schema-2020-12")
        .find(".json-schema-2020-12-accordion__icon--expanded")
        .should("exist")
    })
  })
})
