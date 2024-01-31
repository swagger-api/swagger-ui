describe("#5176: Optional array query params with enum schema are always sent when '--' is selected in options list", () => {
    beforeEach(() => {
        cy.intercept("GET", "/5176*", {
            body: "OK",
        }).as("request")
    })


    it("should only forget the value of the auth the user logged out from", () => {
        cy
            .visit("/?url=/documents/bugs/5176.yaml")
            .get("#operations-default-get_5176") // expand the route details onClick
            .click()
            .get(".btn.try-out__btn") // expand "try it out"
            .click()
            .get(".parameters select")
            .select("--")
            .get(".btn.execute") // execute request
            .click()
            .wait("@request")
            .its("request")
            .then((req) => {
                expect(req.query, "request query params").to.not.have.property("fields")
            })
    })
})
