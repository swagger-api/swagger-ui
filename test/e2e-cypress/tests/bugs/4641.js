describe("#4641: The Logout button in Authorize popup not clearing API Key", () => {
  it("should include the given api key in requests", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get("section>input") // type api key into input
      .type("my_api_key")
      .get(".auth-btn-wrapper > .authorize") // authorise button
      .click()
      .get(".close-modal") // close authorise popup button
      .click()
      .get(".opblock-summary") // expand the route details
      .click()
      .get(".try-out > .btn") // expand "try it out"
      .click()
      .get(".execute-wrapper > .btn") // excecute request
      .click()
      .wait(2000) // wait for response
      .get(".curl")
      .should("contain", "api_key: my_api_key")
  })

  it("should not remember the previous auth value when you logout and reauthorise", () => {
    cy
      .visit("/?url=/documents/bugs/4641.yaml")
      .get("button.btn.authorize") // open authorize popup
      .click()
      .get("section>input") // type api key into input
      .type("my_api_key")
      .get(".auth-btn-wrapper > .authorize") // authorise button
      .click()
      .get(".auth-btn-wrapper button:nth-child(1)") // logout button
      .click()
      .get(".auth-btn-wrapper > .authorize") // authorise button
      .click()
      .get(".close-modal") // close authorise popup button
      .click()
      .get(".opblock-summary") // expand the route details
      .click()
      .get(".try-out > .btn") // expand "try it out"
      .click()
      .get(".execute-wrapper > .btn") // excecute request
      .click()
      .wait(2000) // wait for response
      .get(".curl")
      .should("not.contain", "api_key: my_api_key")
  })
})
