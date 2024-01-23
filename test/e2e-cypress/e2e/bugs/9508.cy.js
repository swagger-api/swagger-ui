describe("#9508: defaultModelExpandDepth not applied to oneOf/anyOf", () => {
    it("should expand oneOf/anyOf schemas", () => {
        cy.visit("/pages/9508/").then(() => {
            cy.get("div.model-example")
                .find("span.json-schema-2020-12-accordion__icon--collapsed")
                .should('have.length', 0)
            cy.contains('anyOf1-p1-p2-p1')
            cy.contains('oneOf1-p1-p2-p1')
        })
    })
})
