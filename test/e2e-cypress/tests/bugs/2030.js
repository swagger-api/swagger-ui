var JSONbigNative = require("json-bigint")({ useNativeBigInt: true })
describe("#5164: multipart property initial values", () => {
  it("should provide correct initial values for objects and arrays", () => {
    const correctObjectValue =  JSONbigNative.stringify(
      JSONbigNative.parse(999888777666555444n
    ),null,2)

    cy
      .visit("?url=/documents/bugs/2030.yaml")
      .get("#operations-default-post_")
      .click()
      .get(".try-out__btn")
      .click()
      .get(`.parameters[data-property-name="first"] input`)
      .should("have.value", correctObjectValue)
  })
})