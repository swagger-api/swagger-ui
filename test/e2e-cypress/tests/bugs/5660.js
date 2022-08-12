// http://github.com/swagger-api/swagger-ui/issues/5660

const expectedValue = "nullable: true"

describe("#5660: Nullable object", () => {
  it("should render `nullable` marker for object itself", () => {
    cy.visit("/?url=/documents/bugs/5660-model.yaml")
      .get("#model-SomeObject .model-toggle")
      .click()
      .get("#model-SomeObject > .model-box")
      .contains(expectedValue)
  })
  it("should render `nullable` marker for next object in property", () => {
    cy.visit("/?url=/documents/bugs/5660-property.yaml")
      .get("#model-SomeObject .model-toggle")
      .click()
      .get("#model-SomeObject > .model-box")
      .contains(expectedValue)
  })
})
