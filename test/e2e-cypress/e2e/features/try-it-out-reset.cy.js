/**
 * @prettier
 */

describe("Reset button in try it out", () => {
  it("should reset the edited request body value and execute try it out with the default value", () => {
    cy.visit("?url=/documents/features/try-it-out-reset.yaml")
      .get("#operations-default-post_users")
      .click()
      .get(".try-out__btn")
      .click()
      .get(`.parameters[data-property-name="name"] input[type=text]`)
      .type("{selectall}not the default name value")
      .get(`.parameters[data-property-name="badgeid"] input[type=text]`)
      .type("{selectall}not the default badge value")
      .get(`.parameters[data-property-name="email"] input[type=text]`)
      .type("{selectall}not the default email value")
      .get(".try-out__btn.reset")
      .click()
      .get(`.parameters[data-property-name="name"] input[type=text]`)
      .should("have.value", "default name")
      .get(`.parameters[data-property-name="badgeid"] input[type=text]`)
      .should("have.value", "12345")
      .get(`.parameters[data-property-name="email"] input[type=text]`)
      .should("have.value", "jsmith@business.com")
  })
})
