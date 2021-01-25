describe("Try it out enabled configuration", () => {
    it("should enable the try it out section when true", () => {

      cy
        .visit("?tryItOutEnabled=true&url=/documents/features/try-it-out-enabled.yaml")
        .get("#operations-default-get_")
        .click()
        .get(".try-out__btn")
        .should("have.text","Cancel")
    })

    it("should disable the try it out section when false", () => {

        cy
          .visit("?tryItOutEnabled=false&url=/documents/features/try-it-out-enabled.yaml")
          .get("#operations-default-get_")
          .click()
          .get(".try-out__btn")
          .should("have.text","Try it out ")
      })
  })
  