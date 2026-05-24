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
      .get(".btn.execute")
      .click()
      .get(".curl-command")
      .contains(
        "name=not%20the%20default%20name%20value&badgeid=not%20the%20default%20badge%20value&email=not%20the%20default%20email%20value"
      )
      .should("exist")
      .get(".try-out__btn.reset")
      .click()
      .get(".btn.execute")
      .click()
      .get(".curl-command")
      .contains("name=default%20name&badgeid=12345&email=jsmith%40business.com")
      .should("exist")
  })
})
