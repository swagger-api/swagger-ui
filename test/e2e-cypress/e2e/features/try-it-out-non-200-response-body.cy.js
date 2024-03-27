/**
 * @prettier
 */
describe("#9556: SwaggerUI doesn't render response bodies for non-200 responses", () => {
  beforeEach(() => {
    const staticResponse = {
      statusCode: 400,
      headers: { "content-type": "plain/text" },
      body: "This should render",
    }
    cy.intercept("GET", "/400-any", staticResponse).as("request")
  })

  it("should render response body for a response with 400 status code", () => {
    cy.visit("?url=/documents/features/try-it-out-non-200-response-body.yaml")
      .get("#operations-default-get_400_any")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".execute")
      .click()
      .wait("@request")
      .get(".response-col_description .highlight-code .microlight")
      .should("have.text", "This should render")
  })
})
