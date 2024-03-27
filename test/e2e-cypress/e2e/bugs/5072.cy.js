describe("#5072: x-www-form-urlencoded request body input when `properties` is missing", () => {
  it("should provide a JSON input for an empty object schema", () => {
    cy
      .visit("?url=/documents/bugs/5072/empty.yaml")
      .get("#operations-default-postObject")
      .click()
      .get(".try-out__btn")
      .click()
      .get(`.opblock-section-request-body textarea`)
      .should("have.value", "{}")
  })
  it("should provide a JSON input for an additionalProperties object schema", () => {
    cy
      .visit("?url=/documents/bugs/5072/additional.yaml")
      .get("#operations-default-postObject")
      .click()
      .get(".try-out__btn")
      .click()
      .get(`.opblock-section-request-body textarea`)
      .contains(`"additionalProp1": "string"`)
  })
})
