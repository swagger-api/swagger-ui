describe("#5070: Required field not highlighted on click of Execute button (second time)", () => {
  it("should not clear error class=invalid on input field (Swagger)", () => {
    cy
      .visit("/?url=/documents/petstore.swagger.yaml")
      .get("#operations-pet-getPetById")
      .click()
      // Expand Try It Out
      .get(".try-out__btn")
      .click()
      // Execute without user input
      .get(".execute.opblock-control__btn")
      .click()
      .get(".parameters-col_description input")
      .should($el => {
        expect($el).to.have.length(1)
        const className = $el[0].className
        expect(className).to.match(/invalid/i)
      })
      // Cancel Try It Out
      .get(".cancel")
      .click()
      // Expand Try It Out (Again)
      .get(".try-out__btn")
      .click()
      .get(".parameters-col_description input")
      .should($el => {
        expect($el).to.have.length(1)
        const className = $el[0].className
        expect(className).to.match(/invalid/i)
      })
  })
})
