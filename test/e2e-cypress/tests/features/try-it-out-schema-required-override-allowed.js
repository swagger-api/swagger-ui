describe("Try It Out: schema required properties can be overriden", () => {
  it("should execute", () => {
    cy
      .visit("?tryItOutEnabled=true&url=/documents/features/try-it-out-schema-required-override-allowed.yaml")
      .get("#operations-default-setDeliveryLocation")
      .click()
      .get(".body-param__text")
      .should("include.value", "testProperty")
      .clear() // swagger-ui will auto insert "{}" into textarea
      .get(".execute-wrapper > .btn")
      .click()
      .get(".curl-command")
      .should("exist")
  })
})
