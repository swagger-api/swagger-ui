describe("#4641: The Logout button in Authorize popup not clearing API Key", () => {
  beforeEach(() => {
    cy.server()
    cy
      .route({
        url: "/4641*",
        response: "OK",
      })
      .as("request")
  })

  it("should include the given api key in requests", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // only deal with api_key_1 for this test
      .within(() => {
        cy
          .get("section>input") // type api key into input
          .type("my_api_key")
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
      })
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_1") // expand the route details
      .within(() => {
        cy
          .get(".opblock-summary")
          .click()
          .get(".try-out > .btn") // expand "try it out"
          .click()
          .get(".execute-wrapper > .btn") // excecute request
          .click()
      })
      .get("@request")
      .its("request.headers.api_key_1")
      .should("equal", "my_api_key")
  })

  it("should not remember the previous auth value when you logout and reauthorise", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // only deal with api_key_1 for this test
      .within(() => {
        cy
          .get("section>input") // type api key into input
          .type("my_api_key")
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
          .get(".auth-btn-wrapper button:nth-child(1)") // logout button
          .click()
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
      })
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_1") // expand the route details
      .within(() => {
        cy
          .get(".opblock-summary")
          .click()
          .get(".try-out > .btn") // expand "try it out"
          .click()
          .get(".execute-wrapper > .btn") // excecute request
          .click()
      })
      .get("@request")
      .its("request.headers")
      .should("not.to.have.property", "api_key_1")
  })

  it("should not only forget the value of the auth the user logged out from", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // deal with api_key_1
      .within(() => {
        cy
          .get("section>input") // type api key into input
          .type("my_api_key")
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
      })
      .get(".modal-ux-content > :nth-child(2)") // deal with api_key_2
      .within(() => {
        cy
          .get("section>input") // type api key into input
          .type("my_second_api_key")
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
      })
      .get(".modal-ux-content > :nth-child(1)") // deal with api_key_1 again
      .within(() => {
        cy
          .get(".auth-btn-wrapper button:nth-child(1)") // logout button
          .click()
          .get(".auth-btn-wrapper > .authorize") // authorise button
          .click()
      })
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_2") // expand the route details
      .within(() => {
        cy
          .get(".opblock-summary")
          .click()
          .get(".try-out > .btn") // expand "try it out"
          .click()
          .get(".execute-wrapper > .btn") // excecute request
          .click()
      })
      .get("@request")
      .its("request.headers")
      .should(headers => {
        expect(headers).not.to.have.property("api_key_1")
        expect(headers).to.have.property("api_key_2", "my_second_api_key")
      })
  })
})
