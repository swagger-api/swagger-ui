// Verifies the HTTP QUERY method (RFC 10008) end-to-end:
// API definition -> UI rendering -> Try it out -> real HTTP request ->
// real local server -> response displayed back in the UI -> curl generation.
//
// The local server at test/e2e-cypress/support/helpers/query-method-server
// echoes back the *actual* `req.method` it received on the wire, so this
// test proves the browser really sent QUERY, not merely that the UI
// displays the word "QUERY".
describe("HTTP QUERY method (RFC 10008)", () => {
  it("renders QUERY as a first-class method and never as GET or POST", () => {
    cy.visit("/?url=/documents/features/query-method.yaml")
      .get("#operations-default-query_query_test")
      .should("have.class", "opblock-query")
      .find(".opblock-summary-method")
      .should("have.text", "QUERY")
      .should("not.have.text", "POST")
      .should("not.have.text", "GET")
  })

  it("executes Try it out and the server actually receives an HTTP QUERY request", () => {
    cy.visit("/?url=/documents/features/query-method.yaml")
      .get("#operations-default-query_query_test .opblock-summary")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".execute.opblock-control__btn")
      .click()
      .wait(500)
      .get(".responses-wrapper .response-col_description .microlight")
      .should("contains.text", "\"method\": \"QUERY\"")
      .get(".responses-wrapper .response-col_description .microlight")
      .should("contains.text", "\"received\": true")
      .get(".responses-wrapper .response-col_description .microlight")
      .should("contains.text", "\"contentType\": \"application/json\"")
      .get(".responses-wrapper .response-col_description .microlight")
      .should("contains.text", "\"status\": \"active\"")
  })

  it("generates a curl command with -X QUERY, never -X POST or -X GET", () => {
    cy.visit("/?url=/documents/features/query-method.yaml")
      .get("#operations-default-query_query_test .opblock-summary")
      .click()
      .get(".try-out__btn")
      .click()
      .get(".execute.opblock-control__btn")
      .click()
      .wait(500)
      .get(".responses-wrapper .curl-command")
      .should("contains.text", "QUERY")
      .find("span")
      .should("not.contains.text", "-X POST")
      .should("not.contains.text", "-X GET")
  })
})
