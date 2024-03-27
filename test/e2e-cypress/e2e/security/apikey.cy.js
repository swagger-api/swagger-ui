describe("ApiKey Authorization", function() {
  it("should have generic description for authorization button", () => {
    cy
      .visit("/?url=/documents/petstore.swagger.yaml")
      .get(".btn.authorize") // open authorization dialog
      .click()
      .get(".modal-ux-content > :nth-child(2)") // only deal with api_key for this test
      .within(() => {
        cy.get(".auth-btn-wrapper .authorize")
          .should("have.attr", "aria-label", "Apply credentials")
      })
  })
})
