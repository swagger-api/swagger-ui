describe("Security: CSS Sequential Import Chaining", () => {
  describe("in OpenAPI 3.0", () => {
    describe("CSS Injection via Markdown", () => {
      it("should filter <style> tags out of Markdown fields", () => {
        cy.visit("/?url=/documents/security/sequential-import-chaining/openapi.yaml")
          .get("div.information-container")
          .should("exist")
          .and("not.have.descendants", "style")
      })
      it("should not apply `@import`ed CSS stylesheets", () => {
        cy.visit("/?url=/documents/security/sequential-import-chaining/openapi.yaml")
          .wait(500) // HACK: wait for CSS import to settle
          .get("div.info h4")
          .should("have.length", 1)
          .and("not.be.hidden")
      })
    })
    describe("Value Exfiltration via CSS", () => {
      it("should not allow OAuth credentials to be visible via HTML `value` attribute", () => {
        cy.visit("/?url=/documents/petstore-expanded.openapi.yaml")
          .get(".scheme-container > .schemes > .auth-wrapper > .btn > span")
          .click()
          .get("div > div > .wrapper > .block-tablet > #client_id_implicit")
          .clear()
          .type("abc")
          .should("not.have.attr", "value", "abc")
      })
    })
  })
  describe("in Swagger 2.0", () => {
    describe("CSS Injection via Markdown", () => {
      it("should filter <style> tags out of Markdown fields", () => {
        cy.visit("/?url=/documents/security/sequential-import-chaining/swagger.yaml")
          .get("div.information-container")
          .should("exist")
          .and("not.have.descendants", "style")
      })
      it("should not apply `@import`ed CSS stylesheets", () => {
        cy.visit("/?url=/documents/security/sequential-import-chaining/swagger.yaml")
          .wait(500) // HACK: wait for CSS import to settle
          .get("div.info h4")
          .should("have.length", 1)
          .and("not.be.hidden")
      })
    })
    describe("Value Exfiltration via CSS", () => {
      it("should not allow OAuth credentials to be visible via HTML `value` attribute", () => {
        cy.visit("/?url=/documents/petstore.swagger.yaml")
          .get(".scheme-container > .schemes > .auth-wrapper > .btn > span")
          .click()
          .get("div > div > .wrapper > .block-tablet > #client_id_implicit")
          .clear()
          .type("abc")
          .should("not.have.attr", "value", "abc")
      })
    })
  })
})
