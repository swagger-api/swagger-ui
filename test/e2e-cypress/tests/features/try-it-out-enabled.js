describe("Try it out enabled configuration", () => {
    it("should provide correct initial values for objects and arrays", () => {

      cy
        .visit("?tryItOutEnabled=true&url=/documents/features/try-it-out-enabled.yaml")
        .get("#operations-default-get_")
        .click()
        .get(".try-out__btn")
        .should("have.text","Cancel")
    })
  })
  