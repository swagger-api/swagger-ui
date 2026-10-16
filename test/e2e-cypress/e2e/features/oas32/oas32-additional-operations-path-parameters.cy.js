/**
 * @prettier
 */
describe("OAS 3.2 additionalOperations inherit Path Item parameters", () => {
  const baseUrl =
    "/?url=/documents/oas32/additional-operations-path-parameters.yaml"

  const operation = (method) =>
    cy
      .get(".opblock")
      .filter(`:has(.opblock-summary-method:contains("${method}"))`)

  const openOperation = (method) => {
    cy.visit(baseUrl)
    operation(method).find(".opblock-summary-control").click()
    return operation(method).should("have.class", "is-open")
  }

  it("shows path-level parameters for an operation without its own parameters", () => {
    openOperation("COPY").within(() => {
      cy.contains("No parameters").should("not.exist")
      cy.get('tr[data-param-name="id"][data-param-in="path"]')
        .should("exist")
        .and("contain", "File ID")
      cy.get('tr[data-param-name="q"][data-param-in="query"]')
        .should("exist")
        .and("contain", "Path-level query")
    })
  })

  it("lets operation-level parameters override path-level ones without removing the rest", () => {
    openOperation("MOVE").within(() => {
      cy.get('tr[data-param-name="id"][data-param-in="path"]').should("exist")
      cy.get('tr[data-param-name="q"][data-param-in="query"]')
        .should("have.length", 1)
        .and("contain", "Operation-level override")
        .and("not.contain", "Path-level query")
    })
  })
})
