/**
 * @prettier
 */

describe("OpenAPI 3.1.0 webhook", () => {
  it("should render the correct example for the request body", () => {
    cy.visit("/?url=/documents/features/oas31-webhook-examples.yaml")
      .get("#operations-webhooks-test-webhook")
      .click()
      .get(".body-param__example")
      .should("contain", '"userId": "userId example from examples"')
      .and("contain", '"orderId": "orderId example from examples"')
      .get(".examples-select-element")
      .eq(0)
      .select("TestExample2")
      .get(".body-param__example")
      .should("contain", '"userId": "second userId example from examples"')
      .and("contain", '"orderId": "second orderId example from examples"')
  })

  it("should render the correct example for the response", () => {
    cy.visit("/?url=/documents/features/oas31-webhook-examples.yaml")
      .get("#operations-webhooks-test-webhook")
      .click()
      .get(".example.microlight")
      .should("contain", '"userId": "userId example from examples"')
      .and("contain", '"orderId": "orderId example from examples"')
      .get(".examples-select-element")
      .eq(1)
      .select("TestExample2")
      .get(".example.microlight")
      .should("contain", '"userId": "second userId example from examples"')
      .and("contain", '"orderId": "second orderId example from examples"')
  })
})
