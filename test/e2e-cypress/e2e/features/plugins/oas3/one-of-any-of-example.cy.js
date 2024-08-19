/**
 * @prettier
 */

describe("OpenAPI 3.0 oneOf and anyOf example", () => {
  it("should show example values for multipart/form-data and application/x-www-form-urlencoded content types", () => {
    cy.visit("/?url=/documents/features/oas3-one-of-any-of-example.yaml").then(
      () => {
        cy.contains("/documentsWithCombineOneOf")
          .click()
          .get(".try-out__btn")
          .click()
          .get("textarea")
          .contains("NestedSchemaExample.pdf")
          .should("exist")
        cy.contains("/documentsWithCombineOneOf").click()
        cy.contains("/documentsWithCombineAnyOf")
          .click()
          .get(".try-out__btn")
          .contains("Try it out")
          .click()
          .get("textarea")
          .contains("ParentSchemaExample.pdf")
          .should("exist")
      }
    )
  })
})
