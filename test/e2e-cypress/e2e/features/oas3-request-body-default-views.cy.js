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
  })
})
