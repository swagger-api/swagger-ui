/**
 * @prettier
 */

describe("OpenAPI 3.1.0 response without content", () => {
  it("should render a response", () => {
    cy.visit(
      "/?configUrl=/configs/oas31-response-no-content.yaml&url=/documents/features/oas31-response-no-content.yaml"
    )
      .get("#operations-Enterprise-get_enterprise_detail")
      .click()
      .get(
        "#operations-Enterprise-get_enterprise_detail [data-code=404] .response-col_description__inner"
      )
      .contains("No enterprise matching the requested ID could be found.")
      .get(
        "#operations-Enterprise-get_enterprise_detail [data-code=404] .model-example"
      )
      .should("not.exist")
  })
})
