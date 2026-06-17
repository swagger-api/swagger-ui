/**
 * @prettier
 */

describe("Try it out with schema type array but example type string", () => {
  it("shows a validation error message when field is required and Execute is clicked", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-example-type-string.yaml"
    )
      .get("#operations-default-get_")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("exist")
  })

  it("executes without providing an initial value when field is not required and Execute is clicked", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-example-type-string.yaml"
    )
      .get("#operations-default-get_notRequired")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should("contain", "http://localhost:3230/notRequired")
  })
})
