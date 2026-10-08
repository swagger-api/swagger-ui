/**
 * @prettier
 */
describe("OAS 3.2 Additional Operations", () => {
  const baseUrl = "/?url=/documents/features/oas32-additional-operations.yaml"
  const copyOperation = "#operations-pets-copyPet"
  const searchOperation = "#operations-pets-searchPets"
  const pingOperation = () =>
    cy.contains(".opblock", "Check health without an operationId")

  const corsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, COPY, PING, Search-Pets",
    "access-control-allow-headers": "*",
  }

  const loadWithConfig = (config) => {
    cy.visit(baseUrl)
    cy.get(copyOperation).should("exist")
    cy.window().then((win) => {
      win.ui = win.SwaggerUIBundle({
        url: "/documents/features/oas32-additional-operations.yaml",
        dom_id: "#swagger-ui",
        presets: [win.SwaggerUIBundle.presets.apis],
        ...config,
      })
    })
  }

  it("renders custom and standard operations on the same path", () => {
    cy.visit(baseUrl)
    cy.get(".opblock-tag-section:not(.webhooks) .opblock").should(
      "have.length.at.least",
      5
    )
    cy.get("#operations-pets-getPet").should("have.class", "opblock-get")
    cy.get(copyOperation).should("have.class", "opblock-custom")
    cy.get(searchOperation).should("have.class", "opblock-custom")
    cy.get(copyOperation)
      .find(".opblock-summary-description")
      .should("have.text", "Copy a pet")
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

  it("expands custom operations and renders referenced parameters and responses", () => {
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
      cy.get(".opblock-summary-operation-id").should("have.text", "searchPets")
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

  it("opens an additional operation from its deep link", () => {
    cy.visit(`${baseUrl}&deepLinking=true#/pets/searchPets`)
    cy.get(searchOperation).should("have.class", "is-open")
    cy.get(copyOperation).should("not.have.class", "is-open")
    cy.get(searchOperation).find(".opblock-summary-control").click()
    cy.get(searchOperation).should("not.have.class", "is-open")
    cy.get(searchOperation).find(".opblock-summary-control").click()
    cy.location("hash").should("eq", "#/pets/searchPets")
  })

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

  it("respects the default submission allowlist for custom methods", () => {
    cy.visit(baseUrl)
    cy.get(copyOperation).find(".opblock-summary-control").click()
    cy.get(copyOperation).find(".try-out__btn").should("not.exist")
  })

  it("renders additional operations in callback and webhook Path Items", () => {
    cy.visit(baseUrl)
    cy.get(copyOperation).find(".opblock-summary-control").click()
    cy.get(copyOperation).contains(".tab-item", "Callbacks").click()
    cy.get("#operations-callbacks-notifyCopy")
      .should("have.class", "opblock-custom")
      .find(".opblock-summary-method")
      .should("have.text", "Notify-Pet")
    // Webhooks: exactly one operation, and no "additionalOperations" pseudo-block
    cy.get(".webhooks .opblock").should("have.length", 1)
    cy.get("#operations-webhooks-notifyPetChanged")
      .should("have.class", "opblock-custom")
      .find(".opblock-summary-method")
      .should("have.text", "Notify-Pet")
    cy.get("#operations-webhooks-additionalOperationspetChanged").should(
      "not.exist"
    )
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

  it("executes a custom method with its exact token", () => {
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
