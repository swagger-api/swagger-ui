describe("#5188: non-string operation summary value", () => {
  it("should gracefully handle an object value for an operation summary", () => {
    cy
      .visit("?url=/documents/bugs/5188.yaml")
      .get("#operations-pet-addPet")
      .click()
      .get(".opblock-summary-description")
      .contains("[object Object]")
    })
})
