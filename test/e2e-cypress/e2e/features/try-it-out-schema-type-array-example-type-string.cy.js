describe("Try it out with schema type array but example type string", () => {
    it("shows a validation error message when Execute is clicked", () => {
      cy
        .visit("?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-type-array-example-type-string.yaml")
        .get("#operations-default-get_")
        .click()
        .get(".btn.execute")
        .click()
        .get(".validation-errors")
        .should("exist")
    })
  })
