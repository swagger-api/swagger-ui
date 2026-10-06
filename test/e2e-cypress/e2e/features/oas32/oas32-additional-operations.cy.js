/**
 * @prettier
 */

describe("OpenAPI 3.2 additional operations", () => {
  const baseUrl =
    "/?url=/documents/features/oas32-additional-operations.yaml&deepLinking=true"
  // Try it out remains opt-in for custom methods through the public configuration.
  const executionUrl = `${baseUrl}&supportedSubmitMethods[0]=get&supportedSubmitMethods[1]=LIST&supportedSubmitMethods[2]=X-Search`
  const listOperation = "#operations-Items-listItems"
  const searchOperation = "#operations-Items-searchItems"
  const getOperation = "#operations-Items-getItems"

  it("renders standard and custom operations on the same path", () => {
    cy.visit(baseUrl)
    cy.get(getOperation)
      .should("have.class", "opblock-get")
      .within(() => {
        cy.get(".opblock-summary-method").should("have.text", "GET")
        cy.get(".opblock-summary-description").should(
          "have.text",
          "Get items with query parameters"
        )
      })
    for (const [operation, method, summary] of [
      [listOperation, "LIST", "List items with a request body"],
      [searchOperation, "X-Search", "Search with a mixed-case custom method"],
    ]) {
      cy.get(operation)
        .should("have.class", "opblock-custom-method")
        .within(() => {
          cy.get(".opblock-summary-method").should(
            "have.text",
            method.toUpperCase()
          )
          cy.get(".opblock-summary-description").should("have.text", summary)
        })
    }
    cy.get(".opblock").should("have.length", 3)
  })

  it("expands custom operation parameters, referenced request body, and responses", () => {
    cy.visit(baseUrl)
    cy.get(listOperation).find(".opblock-summary-control").click()
    cy.get(listOperation)
      .should("have.class", "is-open")
      .within(() => {
        cy.get(".opblock-description-wrapper").should(
          "contain.text",
          "Filter items using the custom LIST method."
        )
        cy.get(".parameters-container").should("contain.text", "status")
        cy.get(".opblock-section-request-body")
          .should("contain.text", "Required item filter")
          .and("contain.text", "category")
        cy.get(".responses-wrapper")
          .should("contain.text", "200")
          .and("contain.text", "Filtered items")
          .and("contain.text", "400")
          .and("contain.text", "Invalid item filter")
      })
    cy.get(getOperation).find(".opblock-summary-control").click()
    cy.get(getOperation).within(() => {
      cy.get(".parameters-container").should("contain.text", "limit")
      cy.get(".opblock-section-request-body").should("not.exist")
    })
  })

  it("opens a custom operation from its deep link after reload", () => {
    cy.visit(`${baseUrl}#/Items/listItems`)
    cy.get(listOperation).should("have.class", "is-open")
    cy.get(getOperation).should("not.have.class", "is-open")
    cy.reload()
    cy.get(listOperation)
      .should("have.class", "is-open")
      .find(".opblock-section-request-body")
      .should("contain.text", "category")
  })

  it("validates the required custom-operation body before execution", () => {
    cy.visit(executionUrl)
    cy.get(listOperation).find(".opblock-summary-control").click()
    cy.get(listOperation).within(() => {
      cy.get(".try-out__btn").click()
      cy.get(".body-param textarea").clear()
      cy.get(".execute").click()
      cy.get(".body-param textarea").should("have.class", "invalid")
      cy.get(".curl-command").should("not.exist")
    })
  })

  for (const [operation, method, url, body] of [
    [listOperation, "LIST", "/api/items", { category: "books" }],
    [searchOperation, "X-Search", "/search-api/items", { term: "notebook" }],
  ]) {
    it(`executes ${method} with the released Swagger Client`, () => {
      const customRequest = cy.stub().as("customRequest")
      // Cypress's Node HTTP proxy rejects extension methods before cy.intercept.
      // Stub only the browser transport; use the real released client to resolve
      // the operation and build its request, leaving document fetches untouched.
      cy.visit(executionUrl, {
        onBeforeLoad(win) {
          const originalFetch = win.fetch.bind(win)
          cy.stub(win, "fetch").callsFake((input, options) => {
            if (input === new URL(url, win.location.origin).href) {
              customRequest(input, options)
              return Promise.resolve(
                new win.Response(JSON.stringify(["matched"]), {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                })
              )
            }
            return originalFetch(input, options)
          })
        },
      })
      cy.get(operation).find(".opblock-summary-control").click()
      cy.get(operation).within(() => {
        cy.get(".try-out__btn").click()
        cy.get(".body-param textarea").should(($textarea) => {
          expect(JSON.parse($textarea.val())).to.deep.equal(body)
        })
        cy.get(".execute").click()
      })
      cy.get("@customRequest")
        .should("have.been.calledOnce")
        .then((stub) => {
          const [requestUrl, request] = stub.firstCall.args
          expect(new URL(requestUrl).pathname).to.equal(url)
          expect(request.method).to.equal(method)
          expect(JSON.parse(request.body)).to.deep.equal(body)
          expect(request.headers["Content-Type"]).to.equal("application/json")
        })
      cy.get(operation)
        .find(".live-responses-table")
        .should("contain.text", "200")
        .and("contain.text", "matched")
    })
  }
})
