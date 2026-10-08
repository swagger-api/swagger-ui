/**
 * @prettier
 */
describe("OAS 3.2 Additional Operations", () => {
  const fixtureUrl = "/documents/features/oas32-additional-operations.yaml"
  const baseUrl = `/?url=${fixtureUrl}`
  const getOperation = "#operations-Items-getItems"
  const listOperation = "#operations-Items-listItems"
  const searchItemsOperation = "#operations-Items-searchItems"

  // Pets
  const copyOperation = "#operations-pets-copyPet"
  const searchOperation = "#operations-pets-searchPets"
  const pingOperation = () =>
    cy.contains(".opblock", "Check health without an operationId")

  const corsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, COPY, PING, Search-Pets",
    "access-control-allow-headers": "*",
  }

  // Try it out is opt-in for custom methods: start Swagger UI again with the exact tokens.
  const loadWithConfig = (config, visitOptions = {}) => {
    cy.visit(baseUrl, visitOptions)
    cy.get(copyOperation).should("exist")
    cy.window().then((win) => {
      win.ui = win.SwaggerUIBundle({
        url: fixtureUrl,
        dom_id: "#swagger-ui",
        presets: [win.SwaggerUIBundle.presets.apis],
        ...config,
      })
    })
  }

  const itemsOperations = () =>
    cy
      .get(".opblock-tag-section")
      .filter(":has(#operations-tag-Items)")
      .find(".opblock")

  describe("rendering", () => {
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
        [
          searchItemsOperation,
          "X-Search",
          "Search with a mixed-case custom method",
        ],
      ]) {
        cy.get(operation)
          .should("have.class", "opblock-custom")
          .within(() => {
            cy.get(".opblock-summary-method").should("have.text", method)
            cy.get(".opblock-summary-description").should("have.text", summary)
          })
      }

      itemsOperations().should("have.length", 3)

      cy.get("#operations-pets-getPet").should("have.class", "opblock-get")
      cy.get(copyOperation).should("have.class", "opblock-custom")
      cy.get(searchOperation).should("have.class", "opblock-custom")
      pingOperation()
        .should("have.class", "opblock-custom")
        .find(".opblock-summary-method")
        .should("have.text", "PING")
    })

    it("preserves exact, case-sensitive custom method labels", () => {
      cy.visit(baseUrl)
      cy.get(copyOperation)
        .find(".opblock-summary-method")
        .should("have.text", "COPY")
      cy.get(searchOperation)
        .find(".opblock-summary-method")
        .should("have.text", "Search-Pets")
      cy.get("#operations-pets-searchPetsLowercase")
        .find(".opblock-summary-method")
        .should("have.text", "search-pets")
      cy.get("#operations-pets-getPet")
        .find(".opblock-summary-method")
        .should("have.text", "GET")
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

    it("renders referenced parameters and responses", () => {
      cy.visit(baseUrl)
      cy.get(copyOperation).find(".opblock-summary-control").click()
      cy.get(copyOperation)
        .should("have.class", "is-open")
        .within(() => {
          cy.get(".opblock-description").should("contain.text", "Copy this pet")
          cy.get(".parameters")
            .should("contain.text", "id")
            .and("contain.text", "destination")
          cy.get(".responses-wrapper")
            .should("contain.text", "201")
            .and("contain.text", "Pet copied")
          cy.get(".responses-wrapper .highlight-code").should(
            "contain.text",
            "name"
          )
        })
    })

    it("renders referenced request bodies and operation-specific metadata", () => {
      loadWithConfig({
        displayOperationId: true,
        supportedSubmitMethods: ["Search-Pets"],
      })
      cy.get(searchOperation).find(".opblock-summary-control").click()
      cy.get(searchOperation).within(() => {
        cy.get(".opblock-summary-operation-id").should(
          "have.text",
          "searchPets"
        )
        cy.get(".opblock-section-request-body").should("contain.text", "Milo")
        cy.get(".responses-wrapper")
          .should("contain.text", "Matching pets")
          .and("contain.text", "400")
        cy.get(".opblock-external-docs__link").should(
          "have.attr",
          "href",
          "https://example.com/search-docs"
        )
        cy.get(".authorization__btn").should("exist")
        cy.get(".try-out__btn").click()
        cy.get(".operation-servers select").should(
          "have.value",
          "https://example.com/search"
        )
      })
    })

    it("ignores additionalOperations entries that duplicate fixed fields", () => {
      cy.visit(baseUrl)
      cy.get("#operations-invalid-createInvalid").should(
        "have.class",
        "opblock-post"
      )
      cy.get("#operations-invalid-duplicatePostUpper").should("not.exist")
      cy.get("#operations-invalid-duplicatePostLower").should("not.exist")
      cy.get("#operations-invalid-createInvalid")
        .find(".opblock-summary-control")
        .click()
      cy.get("#operations-invalid-createInvalid .responses-wrapper")
        .should("contain.text", "Created")
        .and("not.contain.text", "Duplicate response")
    })
  })

  describe("deep linking", () => {
    it("opens a custom operation from its deep link after reload", () => {
      cy.visit(`${baseUrl}&deepLinking=true#/Items/listItems`)
      cy.get(listOperation).should("have.class", "is-open")
      cy.get(getOperation).should("not.have.class", "is-open")
      cy.reload()
      cy.get(listOperation)
        .should("have.class", "is-open")
        .find(".opblock-section-request-body")
        .should("contain.text", "category")
    })

    it("toggles a custom operation and keeps its hash", () => {
      cy.visit(`${baseUrl}&deepLinking=true#/pets/searchPets`)
      cy.get(searchOperation).should("have.class", "is-open")
      cy.get(copyOperation).should("not.have.class", "is-open")
      cy.get(searchOperation).find(".opblock-summary-control").click()
      cy.get(searchOperation).should("not.have.class", "is-open")
      cy.get(searchOperation).find(".opblock-summary-control").click()
      cy.location("hash").should("eq", "#/pets/searchPets")
    })
  })

  describe("state and validation", () => {
    it("keeps parameter values and validation scoped to the custom operation", () => {
      cy.visit(baseUrl)
      cy.get(copyOperation).find(".opblock-summary-control").click()
      cy.get(copyOperation)
        .find(".parameters")
        .should("contain.text", "destination")
      cy.window().then(({ ui }) => {
        const system = ui.getSystem()
        system.specActions.validateParams(["/pets/{id}", "COPY"])
        expect(
          system.specSelectors.validationErrors(["/pets/{id}", "COPY"]).length
        ).to.be.greaterThan(0)
        system.specActions.changeParamByIdentity(
          ["/pets/{id}", "COPY"],
          system.specSelectors
            .specJsonWithResolvedSubtrees()
            .getIn([
              "paths",
              "/pets/{id}",
              "additionalOperations",
              "COPY",
              "parameters",
              0,
            ]),
          "123"
        )
        const values = system.specSelectors
          .parameterValues(["/pets/{id}", "COPY"])
          .toJS()
        expect(values["path.id"]).to.eq("123")
        expect(
          system.specSelectors.parameterValues(["/pets/{id}", "get"]).toJS()
        ).not.to.deep.eq(values)
      })
    })

    it("validates the required custom-operation body before execution", () => {
      loadWithConfig({ supportedSubmitMethods: ["get", "LIST", "X-Search"] })
      cy.get(listOperation).find(".opblock-summary-control").click()
      cy.get(listOperation).within(() => {
        cy.get(".try-out__btn").click()
        cy.get(".body-param textarea").clear()
        cy.get(".execute").click()
        cy.get(".body-param textarea").should("have.class", "invalid")
        cy.get(".curl-command").should("not.exist")
      })
    })

    it("respects the default submission allowlist for custom methods", () => {
      cy.visit(baseUrl)
      cy.get(copyOperation).find(".opblock-summary-control").click()
      cy.get(copyOperation).find(".try-out__btn").should("not.exist")
    })
  })

  describe("callbacks and webhooks", () => {
    it("renders additional operations in callback and webhook Path Items", () => {
      cy.visit(baseUrl)
      cy.get(copyOperation).find(".opblock-summary-control").click()
      cy.get(copyOperation).contains(".tab-item", "Callbacks").click()
      cy.get("#operations-callbacks-notifyCopy")
        .should("have.class", "opblock-custom")
        .find(".opblock-summary-method")
        .should("have.text", "Notify-Pet")

      cy.get(".webhooks .opblock").should("have.length", 2)
      cy.get("#operations-webhooks-notifyPetChanged")
        .should("have.class", "opblock-custom")
        .find(".opblock-summary-method")
        .should("have.text", "Notify-Pet")
      cy.get("#operations-webhooks-additionalOperationspetChanged").should(
        "not.exist"
      )
    })

    it("displays standard OAS 3.2 webhooks", () => {
      cy.visit(baseUrl)
      cy.get("#operations-webhooks-petCreated")
        .should("have.class", "opblock-post")
        .find(".opblock-summary-method")
        .should("have.text", "POST")
      cy.get("#operations-webhooks-petCreated")
        .find(".opblock-summary-control")
        .click()
      cy.get("#operations-webhooks-petCreated")
        .should("contain.text", "A pet was created")
        .and("contain.text", "Received")
    })
  })

  describe("execution", () => {
    for (const [operation, method, url, body] of [
      [listOperation, "LIST", "/api/items", { category: "books" }],
      [
        searchItemsOperation,
        "X-Search",
        "/search-api/items",
        { term: "notebook" },
      ],
    ]) {
      it(`executes ${method} with the released Swagger Client`, () => {
        const customRequest = cy.stub().as("customRequest")
        // Cypress's Node HTTP proxy rejects extension methods before cy.intercept.
        // Stub only the browser transport; the real released client still resolves
        // the operation and builds its request. Document fetches are untouched.
        loadWithConfig(
          { supportedSubmitMethods: ["get", "LIST", "X-Search"] },
          {
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
          }
        )

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

    it("executes COPY with its exact token and headers", () => {
      cy.intercept(
        { method: "OPTIONS", url: "**/pets/123" },
        { statusCode: 204, headers: corsHeaders }
      )
      cy.intercept(
        { method: "COPY", url: "**/pets/123" },
        { statusCode: 201, headers: corsHeaders, body: { name: "Milo" } }
      ).as("copy")

      loadWithConfig({ supportedSubmitMethods: ["COPY"] })
      cy.get(copyOperation).find(".opblock-summary-control").click()
      cy.get(copyOperation).within(() => {
        cy.get(".try-out__btn").click()
        cy.get('tr[data-param-name="id"] input').type("123")
        cy.get('tr[data-param-name="destination"] input').type("/pets/456")
        cy.get(".execute").click()
      })

      cy.wait("@copy").then(({ request }) => {
        expect(request.method).to.eq("COPY")
        expect(request.headers.destination).to.eq("/pets/456")
      })
      cy.get(copyOperation)
        .find(".live-responses-table")
        .should("contain.text", "201")
    })

    // Pending upstream: swagger-client 3.38.2 cannot resolve additionalOperations
    // without an operationId by pathName + method ("Operation undefined not found").
    // Re-enable once supported in swagger-js.
    it.skip("executes a custom operation that has no operationId", () => {
      cy.intercept(
        { method: "OPTIONS", url: "**/health" },
        { statusCode: 204, headers: corsHeaders }
      )
      cy.intercept(
        { method: "PING", url: "**/health" },
        { statusCode: 200, headers: corsHeaders }
      ).as("ping")

      loadWithConfig({ supportedSubmitMethods: ["PING"] })
      pingOperation().find(".opblock-summary-control").click()
      pingOperation().within(() => {
        cy.get(".try-out__btn").click()
        cy.get(".execute").click()
      })
      cy.wait("@ping").its("request.method").should("eq", "PING")
    })
  })
})
