describe("#5164: multipart property initial values", () => {
  it("should provide correct initial values for objects and arrays", () => {
    const correctObjectValue = JSON.stringify({
      "one": "abc",
      "two": 123
    }, null, 2)

    cy
      .visit("?url=/documents/bugs/5164.yaml")
      .get("#operations-default-post_")
      .click()
      .get(".try-out__btn")
      .click()
      .get(`.parameters[data-property-name="first"] textarea`)
      .should("have.value", correctObjectValue)
      .get(`.parameters[data-property-name="second"] input`)
      .should("have.value", "hi")
  })
})
