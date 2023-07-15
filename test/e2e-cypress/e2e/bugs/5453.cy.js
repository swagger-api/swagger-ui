// http://github.com/swagger-api/swagger-ui/issues/5453

  describe("#5453: Responses w/o `content` should not render ModelExample", () => {
   it("should not render a ModelExample section", () => {
     cy.visit("/?url=/documents/bugs/5453.yaml")
       .get("#operations-default-get_foo")
       .click()
       .get(".responses-inner")
       .should("not.have.descendants", ".model-example")
   })
 })
