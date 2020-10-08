// http://github.com/swagger-api/swagger-ui/issues/6361

describe("#6361: Button 'Choose file' missed if type byte", () => {
  it("should render a 'Choose file' button", () => {
    cy.visit("/?url=/documents/bugs/6361.yaml")
      .get("#operations-default-post_pets__petId__image")
      .click()
      .get(".try-out__btn")
      .click()
      .get("input[type='file']")
      .should("exist")
  })
})
