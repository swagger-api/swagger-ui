// http://github.com/swagger-api/swagger-ui/issues/6351

describe("#6351: Server dropdown should change when switched via oas3Actions.setSelectedServer", () => {
  it("should show different selected server", () => {
    cy.visit("/?url=/documents/bugs/6351.yaml")
      .get("select").should("have.value", "http://testserver1.com")
      .window()
      .then(win => win.ui.oas3Actions.setSelectedServer("http://testserver2.com"))
      .get("select").should("have.value", "http://testserver2.com")
  })
})
