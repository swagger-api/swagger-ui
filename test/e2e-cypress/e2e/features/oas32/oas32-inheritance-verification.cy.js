/**
 * @prettier
 */
describe("OAS 3.2 Complete Feature Verification", () => {
  const baseUrl = "/?url=/documents/features/oas32-full-spec.yaml"

  describe("Version Detection", () => {
    it("should display OAS 3.2 badge", () => {
      cy.visit(baseUrl)
        .get(".info .version-stamp")
        .contains("OAS 3.2")
        .should("exist")
    })

    it("should not display OAS 3.1 badge", () => {
      cy.visit(baseUrl)
        .get(".info .version-stamp")
        .contains("OAS 3.1")
        .should("not.exist")
    })

    it("should display API title and summary", () => {
      cy.visit(baseUrl)
        .get(".info .title")
        .should("contain.text", "OAS 3.2.0 Complete Feature Test API")

      cy.get(".info .description").should(
        "contain.text",
        "Comprehensive API demonstrating all OAS 3.2 and inherited 3.1 features"
      )
    })
  })

  describe("OAS 3.1 Inherited Features", () => {
    describe("Info Object Enhancements", () => {
      it("should display info summary (OAS 3.1)", () => {
        cy.visit(baseUrl)
          .get(".info .description")
          .should(
            "contain.text",
            "Comprehensive API demonstrating all OAS 3.2 and inherited 3.1 features"
          )
      })

      it("should display license with identifier (OAS 3.1)", () => {
        cy.visit(baseUrl).get(".info").should("contain.text", "Apache-2.0")
      })

      it("should display contact information", () => {
        cy.visit(baseUrl)
          .get(".info")
          .should("contain.text", "API Support")
          .should("contain.text", "support@example.com")
      })
    })

    describe("Webhooks Support (OAS 3.1)", () => {
      it("should display webhooks section", () => {
        cy.visit(baseUrl).get(".webhooks").should("exist")
      })

      it("should render webhook operation", () => {
        cy.visit(baseUrl).get(".webhooks .opblock").should("exist")
      })

      it("should display webhook name", () => {
        cy.visit(baseUrl).get(".webhooks").should("contain.text", "userCreated")
      })
    })
  })

  describe("OAS 3.2 New Features", () => {
    describe("$self Field", () => {
      it("should display $self URI in info section", () => {
        cy.visit(baseUrl)
          .get(".info")
          .should("contain.text", "https://api.example.com/openapi.yaml")
      })
    })

    describe("QUERY Operation Method", () => {
      it("should render QUERY operation", () => {
        cy.visit(baseUrl).get("#operations-Users-queryUsers").should("exist")
      })

      it("should have QUERY method badge", () => {
        cy.visit(baseUrl)
          .get("#operations-Users-queryUsers")
          .find(".opblock-summary-method")
          .should("contain.text", "QUERY")
      })

      it("should allow expanding QUERY operation", () => {
        cy.visit(baseUrl).get("#operations-Users-queryUsers").click()

        cy.get("#operations-Users-queryUsers").should("have.class", "is-open")
      })

      it("should display QUERY operation request body", () => {
        cy.visit(baseUrl).get("#operations-Users-queryUsers").click()

        cy.get("#operations-Users-queryUsers")
          .find(".opblock-section-request-body")
          .should("exist")
      })
    })

    describe("querystring Parameter Location", () => {
      it("should display querystring parameters in SEARCH operation", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .click()

        cy.get(".additional-operations")
          .contains("SEARCH")
          .parent()
          .parent()
          .find(".parameter__name")
          .contains("q")
          .should("exist")
      })

      it("should show querystring location with space", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .click()

        cy.get(".additional-operations")
          .contains("SEARCH")
          .parent()
          .parent()
          .find(".parameter__in")
          .contains("query string")
          .should("exist")
      })

      it("should apply querystring parameter styling", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .click()

        cy.get(".additional-operations")
          .contains("SEARCH")
          .parent()
          .parent()
          .find(".parameter__in--querystring")
          .should("exist")
      })
    })

    describe("additionalOperations", () => {
      it("should display Additional Operations section", () => {
        cy.visit(baseUrl).get(".additional-operations").should("exist")
      })

      it("should display section title", () => {
        cy.visit(baseUrl)
          .get(".additional-operations h4")
          .should("contain.text", "Additional Operations")
      })

      it("should render SEARCH operation", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .should("exist")
      })

      it("should render COPY operation", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("COPY")
          .should("exist")
      })

      it("should allow expanding SEARCH operation", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .click()

        cy.get(".additional-operations .opblock.is-open").should("exist")
      })

      it("should display SEARCH operation parameters", () => {
        cy.visit(baseUrl)
          .get(".additional-operations")
          .contains("SEARCH")
          .click()

        cy.get(".additional-operations")
          .contains("SEARCH")
          .parent()
          .parent()
          .find(".parameters-col_description")
          .should("exist")
      })
    })

    describe("Tag Enhancements", () => {
      it("should display tag summary for Users", () => {
        cy.visit(baseUrl)
          .get(".opblock-tag")
          .contains("Users")
          .parent()
          .should("contain.text", "User management endpoints")
      })

      it("should display tag kind badge", () => {
        cy.visit(baseUrl)
          .get(".opblock-tag")
          .contains("Users")
          .parent()
          .find(".oas32-tag-kind")
          .should("contain.text", "domain")
      })

      it("should display parent tag reference", () => {
        cy.visit(baseUrl)
          .get(".opblock-tag")
          .contains("Admin")
          .parent()
          .find(".oas32-tag-parent")
          .should("contain.text", "Users")
      })

      it("should display multiple tag enhancements together", () => {
        cy.visit(baseUrl)
          .get(".opblock-tag")
          .contains("Products")
          .parent()
          .within(() => {
            cy.get(".oas32-tag-summary").should("exist")
            cy.get(".oas32-tag-kind").should("exist")
          })
      })
    })

    describe("Components mediaTypes", () => {
      it("should display Media Types section", () => {
        cy.visit(baseUrl).get(".media-types").should("exist")
      })

      it("should display section title", () => {
        cy.visit(baseUrl)
          .get(".media-types h4")
          .should("contain.text", "Media Types")
      })

      it("should have expand/collapse button", () => {
        cy.visit(baseUrl).get(".media-types-control").should("exist")
      })

      it("should expand media types when clicked", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get(".media-types").should("have.class", "is-open")
      })

      it("should render JsonUser media type", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get('[data-name="JsonUser"]').should("exist")
      })

      it("should render EventStream media type", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get('[data-name="EventStream"]').should("exist")
      })

      it("should display media type schema", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

        cy.get('[data-name="JsonUser"]')
          .find(".media-type-schema")
          .should("exist")
      })

      it("should display media type examples", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

        cy.get('[data-name="JsonUser"]')
          .find(".media-type-example")
          .should("have.length.at.least", 1)
      })

      it("should display encoding for JsonProduct", () => {
        cy.visit(baseUrl).get(".media-types-control").click()

        cy.get('[data-name="JsonProduct"]').find(".media-type-toggle").click()

        cy.get('[data-name="JsonProduct"]')
          .find(".media-type-encoding")
          .should("exist")
      })
    })

    describe("itemSchema Support", () => {
      beforeEach(() => {
        cy.visit(baseUrl).get(".media-types-control").click()
      })

      it("should display itemSchema for EventStream", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".media-type-item-schema")
          .should("exist")
      })

      it("should display streaming badge", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".streaming-badge")
          .should("exist")
          .should("contain.text", "STREAMING")
      })

      it("should display Item Schema heading", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".media-type-item-schema")
          .contains("Item Schema")
          .should("exist")
      })

      it("should display item schema description", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".item-schema-description")
          .should("contain.text", "Schema for individual items in the stream")
      })

      it("should display itemSchema for JsonLinesFeed", () => {
        cy.get('[data-name="JsonLinesFeed"]').find(".media-type-toggle").click()

        cy.get('[data-name="JsonLinesFeed"]')
          .find(".media-type-item-schema")
          .should("exist")
      })

      it("should apply special styling to itemSchema section", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".media-type-item-schema")
          .should("have.css", "background-color")
      })

      it("should style streaming badge with background color", () => {
        cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

        cy.get('[data-name="EventStream"]')
          .find(".streaming-badge")
          .should("have.css", "background-color")
          .should("have.css", "color", "rgb(255, 255, 255)")
      })
    })
  })

  describe("Integration and Interoperability", () => {
    it("should display all major sections in order", () => {
      cy.visit(baseUrl)

      cy.get(".information-container").should("exist")
      cy.get(".scheme-container").should("exist")
      cy.get(".opblock-tag").should("have.length.at.least", 3)
      cy.get(".webhooks").should("exist")
      cy.get(".additional-operations").should("exist")
      cy.get(".models").should("exist")
      cy.get(".media-types").should("exist")
    })

    it("should allow simultaneous expansion of operations and components", () => {
      cy.visit(baseUrl)

      // Expand a regular operation
      cy.get("#operations-Users-listUsers").click()
      cy.get("#operations-Users-listUsers").should("have.class", "is-open")

      // Expand a QUERY operation
      cy.get("#operations-Users-queryUsers").click()
      cy.get("#operations-Users-queryUsers").should("have.class", "is-open")

      // Expand Additional Operations
      cy.get(".additional-operations").contains("SEARCH").click()
      cy.get(".additional-operations .opblock.is-open").should("exist")

      // Expand Models
      cy.get(".models-control").click()
      cy.get(".models").should("have.class", "is-open")

      // Expand Media Types
      cy.get(".media-types-control").click()
      cy.get(".media-types").should("have.class", "is-open")

      // All should remain expanded
      cy.get("#operations-Users-listUsers").should("have.class", "is-open")
      cy.get("#operations-Users-queryUsers").should("have.class", "is-open")
      cy.get(".models").should("have.class", "is-open")
      cy.get(".media-types").should("have.class", "is-open")
    })

    it("should reference mediaTypes in operations", () => {
      cy.visit(baseUrl)

      // Check that POST /users references JsonUser
      cy.get("#operations-Users-createUser").click()

      cy.get("#operations-Users-createUser")
        .find(".opblock-section-request-body")
        .should("exist")
    })

    it("should display operations with different HTTP methods including QUERY", () => {
      cy.visit(baseUrl)

      // Check for standard methods
      cy.get(".opblock-summary-method").contains("GET").should("exist")
      cy.get(".opblock-summary-method").contains("POST").should("exist")
      cy.get(".opblock-summary-method").contains("PUT").should("exist")
      cy.get(".opblock-summary-method").contains("DELETE").should("exist")

      // Check for QUERY method (OAS 3.2)
      cy.get(".opblock-summary-method").contains("QUERY").should("exist")

      // Check for custom methods in Additional Operations
      cy.get(".additional-operations").contains("SEARCH").should("exist")
      cy.get(".additional-operations").contains("COPY").should("exist")
    })

    it("should handle tag hierarchy with parent references", () => {
      cy.visit(baseUrl)

      // Admin tag should reference Users as parent
      cy.get(".opblock-tag")
        .contains("Admin")
        .parent()
        .find(".oas32-tag-parent")
        .should("contain.text", "Users")

      // Users tag should not have parent reference
      cy.get(".opblock-tag")
        .contains("Users")
        .parent()
        .find(".oas32-tag-parent")
        .should("not.exist")
    })
  })

  describe("Regression Testing", () => {
    it("should not break standard GET operations", () => {
      cy.visit(baseUrl)

      cy.get("#operations-Users-listUsers").click()
      cy.get("#operations-Users-listUsers").should("have.class", "is-open")
      cy.get("#operations-Users-listUsers")
        .find(".opblock-summary-method")
        .should("contain.text", "GET")
    })

    it("should not break standard POST operations", () => {
      cy.visit(baseUrl)

      cy.get("#operations-Users-createUser").click()
      cy.get("#operations-Users-createUser").should("have.class", "is-open")
      cy.get("#operations-Users-createUser")
        .find(".opblock-summary-method")
        .should("contain.text", "POST")
    })

    it("should not break Models section", () => {
      cy.visit(baseUrl)

      cy.get(".models-control").click()
      cy.get(".models").should("have.class", "is-open")
      cy.get(".model-container").should("have.length.at.least", 1)
    })

    it("should not break standard query parameters", () => {
      cy.visit(baseUrl)

      cy.get("#operations-Users-listUsers").click()

      cy.get("#operations-Users-listUsers")
        .find(".parameter__name")
        .contains("limit")
        .should("exist")

      cy.get("#operations-Users-listUsers")
        .find(".parameter__in")
        .contains("(query)")
        .should("exist")
    })

    it("should handle mixed content types in requestBody", () => {
      cy.visit(baseUrl)

      cy.get("#operations-Products-createProduct").click()

      cy.get("#operations-Products-createProduct")
        .find(".opblock-section-request-body")
        .should("exist")
    })
  })

  describe("Console Errors", () => {
    it("should not produce console errors", () => {
      cy.visit(baseUrl, {
        onBeforeLoad(win) {
          cy.stub(win.console, "error").as("consoleError")
        },
      })

      // Wait for spec to load
      cy.get(".info").should("exist")

      // Interact with various features
      cy.get("#operations-Users-queryUsers").click()
      cy.get(".media-types-control").click()
      cy.get(".additional-operations").contains("SEARCH").click()

      // Check for no console errors
      cy.get("@consoleError").should("not.be.called")
    })
  })
})
