/**
 * @prettier
 */

describe("Try it out: schema type array with example or parameter examples", () => {
  it("shows a validation error message when field is required and example is a string", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_requiredStringExample")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("exist")
  })

  it("executes with the initial value when field is not required and example is an array", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_arrayExample")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should(
        "contain",
        "'http://localhost:3230/arrayExample?test=test1&test=test2'"
      )
  })

  it("executes with the initial value when field is not required and example is a stringified array", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_stringifiedArrayExample")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should(
        "contain",
        "'http://localhost:3230/stringifiedArrayExample?test=test1&test=test2'"
      )
  })

  it("executes without the initial value when field is not required and example is a string", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_stringExample")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should("contain", "'http://localhost:3230/stringExample'")
  })

  it("executes with the initial value when field is not required and parameter examples are arrays", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_parameterArrayExamples")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should(
        "contain",
        "'http://localhost:3230/parameterArrayExamples?test=test1&test=test2'"
      )
  })

  it("executes with the initial value when field is not required and parameter examples are stringified arrays", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_parameterStringifiedArrayExamples")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should(
        "contain",
        "'http://localhost:3230/parameterStringifiedArrayExamples?test=test1&test=test2'"
      )
  })

  it("executes without the initial value when field is not required and parameter examples are strings", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_parameterStringExamples")
      .click()
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should("contain", "'http://localhost:3230/parameterStringExamples'")
  })

  it("executes without the chosen examples value when field is not required and parameter examples are strings", () => {
    cy.visit(
      "?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-with-example.yaml"
    )
      .get("#operations-default-get_parameterStringExamples")
      .click()
      .get(".examples-select-element")
      .select("example2")
      .get(".btn.execute")
      .click()
      .get(".validation-errors")
      .should("not.exist")
      .get(".curl.microlight")
      .should("contain", "'http://localhost:3230/parameterStringExamples'")
  })
})
