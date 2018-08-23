describe("Deep linking feature", () => {
  describe("in Swagger 2", () => {
    beforeEach(() => {
      cy.visit("/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml")
    })
    it("should generate an element ID and URL fragment for an operation", () => {
      cy.get(".opblock-get")
        .should("exist")
        .should("have.id", "operations-myTag-myOperation")
        .click()
        .window()
        .should("have.deep.property", "location.hash", "#/myTag/myOperation")
    })
    it("should generate an element ID and URL fragment for an operation with spaces", () => {
      cy.get(".opblock-post")
        .should("exist")
        .should("have.id", "operations-my_Tag-my_Operation")
        .click()
        .window()
        .should("have.deep.property", "location.hash", "#/my%20Tag/my%20Operation")
    })
  })
  describe("in OpenAPI 3", () => {
    beforeEach(() => {
      cy.visit("/?deepLinking=true&url=/documents/features/deep-linking.openapi.yaml")
    })
    it("should generate an element ID and URL fragment for an operation", () => {
      cy.get(".opblock-get")
        .should("exist")
        .should("have.id", "operations-myTag-myOperation")
        .click()
        .window()
        .should("have.deep.property", "location.hash", "#/myTag/myOperation")
    })
    it("should generate an element ID and URL fragment for an operation with spaces", () => {
      cy.get(".opblock-post")
        .should("exist")
        .should("have.id", "operations-my_Tag-my_Operation")
        .click()
        .window()
        .should("have.deep.property", "location.hash", "#/my%20Tag/my%20Operation")
    })
  })
})