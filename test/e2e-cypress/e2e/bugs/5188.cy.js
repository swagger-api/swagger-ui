describe("#5188: non-string operation summary value", () => {
  it("should gracefully handle an object value for an operation summary", () => {
    cy
      .visit("?url=/documents/bugs/5188.yaml")
      .get("#operations-default-objectSummary")
      .click()
      .get(".opblock-summary-description")
      .contains("[object Object]")
  })
  it("should gracefully handle a missing value for an operation summary", () => {
    cy
      .visit("?url=/documents/bugs/5188.yaml")
      .get("#operations-default-noSummary")
      .click()
      // check for response rendering; makes sure the Operation itself rendered
      .contains("Invalid input")
  })
})
