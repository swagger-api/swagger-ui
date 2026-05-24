/**
 * @prettier
 */
describe("OAS 3.2 QUERY Operation Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-query-operation.yaml"

  describe("QUERY Operation Rendering", () => {
    it("should render QUERY operation in the operations list", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .should("exist")
    })

    it("should display QUERY method with correct styling", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .should("have.class", "opblock-query")
    })

    it("should render QUERY operation summary", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .within(() => {
          cy.get(".opblock-summary-description").should(
            "contain.text",
            "Search with complex query payload"
          )
        })
    })

    it("should display QUERY badge/label", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .within(() => {
          cy.get(".opblock-summary-method").should("contain.text", "QUERY")
        })
    })
  })

  describe("QUERY Operation Expansion", () => {
    it("should expand QUERY operation when clicked", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .should("have.class", "is-open")
    })

    it("should display operation description when expanded", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .within(() => {
          cy.get(".opblock-description-wrapper").should("exist")
          cy.get(".renderedMarkdown").should(
            "contain.text",
            "QUERY HTTP method"
          )
        })
    })
  })

  describe("QUERY Operation Request Body", () => {
    it("should render request body section", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".opblock-section-request-body")
        .should("exist")
    })

    it("should show request body is required", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".opblock-section-request-body")
        .should("exist")
        .within(() => {
          cy.get(".opblock-description-wrapper").should("exist")
        })
    })

    it("should render request body schema with properties", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".opblock-section-request-body")
        .within(() => {
          cy.contains("query").should("exist")
          cy.contains("filters").should("exist")
          cy.contains("pagination").should("exist")
        })
    })
  })

  describe("QUERY Operation Responses", () => {
    it("should render response section", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".responses-wrapper")
        .should("exist")
    })

    it("should display 200 response", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".responses-wrapper")
        .within(() => {
          cy.contains("200").should("exist")
          cy.contains("Search results").should("exist")
        })
    })

    it("should display error responses", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuery")
        .click()
        .get(".responses-wrapper")
        .within(() => {
          cy.contains("400").should("exist")
          cy.contains("413").should("exist")
        })
    })
  })

  describe("Mixed Operations on Same Path", () => {
    it("should render both GET and QUERY operations for /products/search", () => {
      cy.visit(baseUrl)
      cy.get("#operations-Search-searchProducts").should("exist")
      cy.get("#operations-Search-advancedSearchProducts").should("exist")
    })

    it("should distinguish GET and QUERY operations visually", () => {
      cy.visit(baseUrl)
      cy.get("#operations-Search-searchProducts")
        .should("have.class", "opblock-get")
        .within(() => {
          cy.get(".opblock-summary-method").should("contain.text", "GET")
        })

      cy.get("#operations-Search-advancedSearchProducts")
        .should("have.class", "opblock-query")
        .within(() => {
          cy.get(".opblock-summary-method").should("contain.text", "QUERY")
        })
    })

    it("should show GET operation with query parameters", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchProducts")
        .click()
        .within(() => {
          cy.contains("Parameters").should("exist")
          cy.contains("q").should("exist")
        })
    })

    it("should show QUERY operation with request body", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-advancedSearchProducts")
        .click()
        .get(".opblock-section-request-body")
        .should("exist")
        .within(() => {
          cy.contains("priceRange").should("exist")
          cy.contains("specifications").should("exist")
        })
    })
  })

  describe("OAS Version Detection", () => {
    it("should display OAS 3.2 badge", () => {
      cy.visit(baseUrl)
        .get(".info .version-stamp")
        .contains("OAS 3.2")
        .should("exist")
    })
  })
})
