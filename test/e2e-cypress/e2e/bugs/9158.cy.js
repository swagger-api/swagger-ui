describe("#9158: Reset button creates invalid inputs in the Try It Out form", () => {
    it("it reset the user edited value and executes with the default value in case of try out reset. (#6517)", () => {
      cy
        .visit("?url=/documents/bugs/9158.yaml")
        .get("#operations-default-post_users")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        // replace multiple default values with bad value
        .get(`.parameters[data-property-name="name"] input[type=text]`)
        .type("{selectall}not the default name value")
        .get(`.parameters[data-property-name="badgeid"] input[type=text]`)
        .type("{selectall}not the default badge value")
        // Reset Try It Out
        .get(".try-out__btn.reset")
        .click()
        // Submit using default value
        .get(".btn.execute")
        .click()
        // No required validation error on body parameter
        .get(`.parameters[data-property-name="name"] input`)
        .should("have.value", "default name")
        .and("not.have.class", "invalid")
        .get(`.parameters[data-property-name="badgeid"] input`)
        .should("have.value", "12345")
        .and("not.have.class", "invalid")
    })
  })