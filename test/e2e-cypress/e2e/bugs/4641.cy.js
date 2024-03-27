const clickTryItOutAndExecute = () => {
  return cy
    .get(".btn.try-out__btn") // expand "try it out"
    .click()
    .get(".btn.execute") // execute request
    .click()
}

const fillInApiKeyAndAuthorise = apiKey => () => {
  return cy
    .get("section>input") // type api key into input
    .type(apiKey)
    .get(".auth-btn-wrapper > .authorize") // authorise button
    .click()
}

const clickLogoutAndReauthorise = () => {
  return cy
    .get(".auth-btn-wrapper button:nth-child(1)") // logout button
    .click()
    .get(".auth-btn-wrapper > .authorize") // authorise button
    .click()
}

describe("#4641: The Logout button in Authorize popup not clearing API Key", () => {
  beforeEach(() => {
    cy.intercept("GET", "/4641*", {
      body: "OK",
    }).as("request")
  })

  it("should include the given api key in requests", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // only deal with api_key_1 for this test
      .within(fillInApiKeyAndAuthorise("my_api_key"))
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_1") // expand the route details onClick
      .click()
      .within(clickTryItOutAndExecute)
      .wait("@request")
      .its("request")
      .then((req) => {
        expect(req.headers, "request headers").to.have.property("api_key_1", "my_api_key")
      })
  })

  it("should not remember the previous auth value when you logout and reauthorise", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // only deal with api_key_1 for this test
      .within(fillInApiKeyAndAuthorise("my_api_key"))
      .get(".modal-ux-content > :nth-child(1)") // only deal with api_key_1 for this test
      .within(clickLogoutAndReauthorise)
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_1") // expand the route details onClick
      .click()
      .within(clickTryItOutAndExecute)
      .wait("@request")
      .its("request")
      .then((req) => {
        expect(req.headers, "request headers").not.to.have.property("api_key_1")
      })
  })

  it("should only forget the value of the auth the user logged out from", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get(".modal-ux-content > :nth-child(1)") // deal with api_key_1
      .within(fillInApiKeyAndAuthorise("my_api_key"))
      .get(".modal-ux-content > :nth-child(2)") // deal with api_key_2
      .within(fillInApiKeyAndAuthorise("my_second_api_key"))
      .get(".modal-ux-content > :nth-child(1)") // deal with api_key_1 again
      .within(clickLogoutAndReauthorise)
      .get(".close-modal") // close authorise popup button
      .click()
      .get("#operations-default-get_4641_2") // expand the route details onClick
      .click()
      .within(clickTryItOutAndExecute)
      .wait("@request")
      .its("request")
      .then((req) => {
        expect(req.headers, "request headers").not.to.have.property("api_key_1")
        expect(req.headers, "request headers").to.have.property("api_key_2", "my_second_api_key")
      })
  })
})
