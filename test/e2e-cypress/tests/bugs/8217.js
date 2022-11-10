describe("#8217: Reset Request Body not using default values", () => {
  it("it reset the user edited value and executes with the default value in case of try out reset. (#6517)", () => {
    cy
      .visit("?url=/documents/bugs/8217.yaml")
      .get("#operations-default-addPet")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // replace default sample with bad value
      .get(`.parameters[data-property-name="bodyParameter"] input`)
      .type("{selectall}not the default value")
      // Reset Try It Out
      .get(".try-out__btn.reset")
      .click()
      // Submit using default value
      .get(".btn.execute")
      .click()
      // No required validation error on body parameter
      .get(`.parameters[data-property-name="bodyParameter"] input`)
      .should("have.value", "default")
      .and("not.have.class", "invalid")
  })
})