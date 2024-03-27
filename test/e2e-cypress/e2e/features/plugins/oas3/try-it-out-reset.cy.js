/**
 * @prettier
 */

describe("Reset button in try it out", () => {
  it("should reset the edited request body value and execute try it out with the default value", () => {
    cy.visit("?url=/documents/features/oas3-try-it-out-reset.yaml")
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
