describe("#4943: XML example not rendered correctly with oneOf", () => {
  it("should render integer property correctly", () => {
    cy
      .visit("/?url=/documents/bugs/4943.yaml")
      .get("#operations-Test-postTest")
      .click()
      .get(".microlight")
      .contains("<b>0</b>")
  })
  it("should render oneOf property correctly", () => {
    cy
      .visit("/?url=/documents/bugs/4943.yaml")
      .get("#operations-Test-postTest")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".microlight")
      .contains("<c>\n\t</c>")
  })
})
