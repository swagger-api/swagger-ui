describe("OAS3 default views", () => {
  describe("multipart/form-data", () => {
    it("should display calculated object string, when no examples provided (#7268)", () => {
      cy.visit(
        "/?url=/documents/features/request-body/multipart/default-views.yaml",
      )
        .get("#operations-default-post_test")
        .click()
        // Expand Try It Out
        .get(".try-out__btn")
        .click()
        .get(".parameters-col_description textarea")
        .should("contains.text", "\"stuff\": \"string\"")
    })

    it("should display calculated object string as example (#4581, #5169, #9756)", () => {
      cy.visit(
        "/?url=/documents/features/request-body/multipart/default-views.yaml",
      )
        .get("#operations-default-post_test")
        .click()
        // Show example
        .get(".parameters-col_description code")
        .should("contains.text", "\"stuff\": \"string\"")
        // Switch to schema
        .get(".parameters-col_description")
        .contains("Schema")
        .click()
        .get(".parameters-col_description")
        .should("contains.text", "parameters")
        .should("not.contain.text", "file")
        .should("contains.text", "TestBody")
        // Expand Try It Out to hide example
        .get(".try-out__btn")
        .click()
        .get(".parameters-col_description textarea")
        .should("contains.text", "\"stuff\": \"string\"")
    })
  })
})
