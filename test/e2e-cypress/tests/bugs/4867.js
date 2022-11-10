describe("#4867: callback parameter rendering", () => {
  it("should render parameters correctly", () => {
    cy
      .visit("/?url=/documents/bugs/4867.yaml")
      .get("#operations-default-myOp")
      .click()
      .contains("Callbacks")
      .click()

      .get(".callbacks-container .opblock-summary-path")
      .should("have.attr", "data-path", "http://$request.query.url")
      .click()

      .get(".parameters-container")
      .contains("myParam")
  })
})
