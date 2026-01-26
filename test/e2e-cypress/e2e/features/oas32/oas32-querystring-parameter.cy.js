/**
 * @prettier
 */
describe("OAS 3.2 querystring Parameter Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-querystring-parameter.yaml"

  describe("querystring Parameter Rendering", () => {
    it("should render querystring parameters in the parameters list", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-in="querystring"]')
        .should("have.length.at.least", 1)
    })

    it('should display "query string" (with space) for querystring parameters', () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-in="querystring"]')
        .first()
        .within(() => {
          cy.get(".parameter__in").should("contain.text", "query string")
        })
    })

    it("should apply special styling to querystring parameters", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-in="querystring"]')
        .first()
        .within(() => {
          cy.get(".parameter__in").should(
            "have.class",
            "parameter__in--querystring"
          )
        })
    })

    it("should display querystring parameter name and description", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-name="query"][data-param-in="querystring"]')
        .should("exist")
        .within(() => {
          cy.get(".parameter__name").should("contain.text", "query")
          cy.contains("Main search query term").should("exist")
        })
    })

    it("should show required indicator for required querystring parameters", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-name="query"][data-param-in="querystring"]')
        .within(() => {
          cy.get(".parameter__name.required").should("exist")
          cy.get(".parameter__name span").should("contain.text", "*")
        })
    })

    it("should display querystring parameter schema type", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-name="query"][data-param-in="querystring"]')
        .within(() => {
          cy.get(".parameter__type").should("contain.text", "string")
        })
    })
  })

  describe("Complex querystring Parameters", () => {
    it("should render querystring parameter with object schema", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-name="filter"][data-param-in="querystring"]')
        .should("exist")
        .within(() => {
          cy.get(".parameter__type").should("contain.text", "object")
        })
    })

    it("should display querystring parameter with enum values", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get('tr[data-param-name="sort"][data-param-in="querystring"]')
        .should("exist")
        .within(() => {
          cy.get(".parameter__type").should("contain.text", "string")
        })
    })
  })

  describe("Mixed Parameters (query vs querystring)", () => {
    it("should distinguish between query and querystring parameters", () => {
      cy.visit(baseUrl)
      cy.get("#operations-Search-searchWithQuerystring").click()

      // Check standard query parameter
      cy.get('tr[data-param-name="limit"][data-param-in="query"]').within(
        () => {
          cy.get(".parameter__in")
            .should("contain.text", "query")
            .should("not.have.class", "parameter__in--querystring")
        }
      )

      // Check querystring parameter
      cy.get('tr[data-param-name="query"][data-param-in="querystring"]').within(
        () => {
          cy.get(".parameter__in")
            .should("contain.text", "query string")
            .should("have.class", "parameter__in--querystring")
        }
      )
    })

    it("should render both parameter types in the same operation", () => {
      cy.visit(baseUrl).get("#operations-Search-searchWithQuerystring").click()

      // Should have querystring parameters
      cy.get('tr[data-param-in="querystring"]').should(
        "have.length.at.least",
        1
      )

      // Should have standard query parameters
      cy.get('tr[data-param-in="query"]').should("have.length.at.least", 1)
    })
  })

  describe("querystring with QUERY Method", () => {
    it("should support querystring parameters with QUERY operation", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-advancedSearch")
        .click()
        .get('tr[data-param-in="querystring"]')
        .should("have.length.at.least", 1)
    })

    it("should show both querystring parameters and request body for QUERY operation", () => {
      cy.visit(baseUrl).get("#operations-Search-advancedSearch").click()

      // Should have querystring parameters
      cy.get(
        'tr[data-param-name="complexFilter"][data-param-in="querystring"]'
      ).should("exist")

      // Should have request body
      cy.get(".opblock-section-request-body").should("exist")
    })
  })

  describe("Try It Out with querystring Parameters", () => {
    it("should enable editing querystring parameters in Try It Out mode", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get(".try-out__btn")
        .click()
        .get('tr[data-param-name="query"][data-param-in="querystring"]')
        .within(() => {
          cy.get("input").should("exist").should("not.be.disabled")
        })
    })

    it("should allow entering values for querystring parameters", () => {
      cy.visit(baseUrl)
        .get("#operations-Search-searchWithQuerystring")
        .click()
        .get(".try-out__btn")
        .click()
        .get('tr[data-param-name="query"][data-param-in="querystring"]')
        .within(() => {
          cy.get("input")
            .clear()
            .type("test search query")
            .should("have.value", "test search query")
        })
    })
  })

  describe("Mixed Parameters on Same Path", () => {
    it("should render operation with both query and querystring parameters", () => {
      cy.visit(baseUrl).get("#operations-Products-listProducts").click()

      // Should have standard query parameters
      cy.get('tr[data-param-name="category"][data-param-in="query"]').should(
        "exist"
      )
      cy.get('tr[data-param-name="page"][data-param-in="query"]').should(
        "exist"
      )

      // Should have querystring parameters
      cy.get(
        'tr[data-param-name="filters"][data-param-in="querystring"]'
      ).should("exist")
      cy.get(
        'tr[data-param-name="includeVariants"][data-param-in="querystring"]'
      ).should("exist")
    })

    it("should visually distinguish parameter types", () => {
      cy.visit(baseUrl).get("#operations-Products-listProducts").click()

      // Query parameter should not have querystring class
      cy.get('tr[data-param-name="category"][data-param-in="query"]').within(
        () => {
          cy.get(".parameter__in").should(
            "not.have.class",
            "parameter__in--querystring"
          )
        }
      )

      // Querystring parameter should have querystring class
      cy.get(
        'tr[data-param-name="filters"][data-param-in="querystring"]'
      ).within(() => {
        cy.get(".parameter__in").should(
          "have.class",
          "parameter__in--querystring"
        )
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
