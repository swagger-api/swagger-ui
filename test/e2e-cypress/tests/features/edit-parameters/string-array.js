describe("Edit parameters", () => {
    describe("String array parameter", () => {
      it("should render button add only if no value", () => {
        cy
          .visit("/?url=/documents/features/edit-parameters/string-array-parameter.yaml")
          .get(".opblock-summary-control")
          .click()
          .get(".try-out__btn")
          .click()
          .get(".json-schema-array")
          .should("have.length", 1)
          .find(".json-schema-form-item-add")
          .should("be.visible")
      })
      it("should render an input if clicking on add button", () => {
        cy
            .visit("/?url=/documents/features/edit-parameters/string-array-parameter.yaml")
            .get(".opblock-summary-control")
            .click()
            .get(".try-out__btn")
            .click()
        
        cy
            .get(".json-schema-array")
            .find(".json-schema-form-item-add")
            .should("be.visible")
            .click()
            .get(".json-schema-array")
            .children()
            .should('have.length', 2)
      })

      it("should render an input with a placeholder if clicking on add button", () => {
        cy
            .visit("/?url=/documents/features/edit-parameters/string-array-parameter.yaml")
            .get(".opblock-summary-control")
            .click()
            .get(".try-out__btn")
            .click()
            .get(".json-schema-array")
            .children()
        
        cy
            .get(".json-schema-array")
            .find(".json-schema-form-item-add")
            .should("be.visible")
            .click()
        
        cy
            .get(".json-schema-array input")
            .should("have.attr", "placeholder")
            .and('match', /string/)
      })
    })
})