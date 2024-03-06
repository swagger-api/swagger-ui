/**
 * @prettier
 */

describe("defaultModelRendering set to model", () => {
  it("should not render schemas for responses with no defined schemas", () => {
    cy.visit(
      "/?defaultModelRendering=model&url=/documents/features/default-model-rendering.yaml"
    )
      .get("#operations-default-get_")
      .click()
      .get(
        "#operations-default-get_ [data-code=200] .response-col_description__inner"
      )
      .contains("no content")
      .get("#operations-default-get_ [data-code=200] .model-example")
      .should("not.exist")
      .get(
        "#operations-default-get_ [data-code=201] .response-col_description__inner"
      )
      .contains("no schema but an example")
      .get("#operations-default-get_ [data-code=201] .model-example")
      .contains('"foo": "bar"')
      .should("exist")
      .get(
        "#operations-default-get_ [data-code=202] .response-col_description__inner"
      )
      .contains("no schema but examples")
      .get("#operations-default-get_ [data-code=202] .model-example")
      .contains('"foo": "bar"')
      .should("exist")
      .get(
        "#operations-default-get_ [data-code=203] .response-col_description__inner"
      )
      .contains("no schema no example")
      .get("#operations-default-get_ [data-code=203] .model-example")
      .should("not.exist")
  })
})
