/**
 * @prettier
 */
describe("OAS 3.2 additionalOperations Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-additional-operations.yaml"

  describe("Additional Operations Section", () => {
    it("should render Additional Operations section", () => {
      cy.visit(baseUrl).get(".additional-operations").should("exist")
    })

    it("should display section title", () => {
      cy.visit(baseUrl)
        .get(".additional-operations h2")
        .should("contain.text", "Additional Operations")
    })

    it("should display section description", () => {
      cy.visit(baseUrl)
        .get(".additional-operations__description")
        .should("exist")
        .should("contain.text", "Custom HTTP methods")
    })
  })

  describe("Custom HTTP Methods Rendering", () => {
    it("should render COPY operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .should("exist")
    })

    it("should render MOVE operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-moveDocument")
        .should("exist")
    })

    it("should render LOCK operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-lockDocument")
        .should("exist")
    })

    it("should render UNLOCK operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-unlockDocument")
        .should("exist")
    })

    it("should render PROPFIND operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-findCollectionProperties")
        .should("exist")
    })

    it("should render PROPPATCH operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-patchCollectionProperties")
        .should("exist")
    })

    it("should render MKCOL operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-makeCollection")
        .should("exist")
    })

    it("should render custom SEARCH operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-searchCustom")
        .should("exist")
    })
  })

  describe("Operation Details", () => {
    it("should display operation summary for COPY", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .within(() => {
          cy.get(".opblock-summary-description").should(
            "contain.text",
            "Copy document"
          )
        })
    })

    it("should expand COPY operation when clicked", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .should("have.class", "is-open")
    })

    it("should display operation description when expanded", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .within(() => {
          cy.get(".renderedMarkdown").should("contain.text", "WebDAV COPY")
        })
    })

    it("should display operation method badge", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .within(() => {
          cy.get(".opblock-summary-method").should("contain.text", "COPY")
        })
    })

    it("should display operation path", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .within(() => {
          cy.get(".opblock-summary-path").should(
            "contain.text",
            "/documents/{documentId}"
          )
        })
    })
  })

  describe("Operation Parameters", () => {
    it("should display path parameters for COPY operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get('tr[data-param-name="documentId"]')
        .should("exist")
    })

    it("should display header parameters for COPY operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get('tr[data-param-name="Destination"]')
        .should("exist")
        .within(() => {
          cy.get(".parameter__in").should("contain.text", "header")
        })
    })

    it("should display required header parameter", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get('tr[data-param-name="Destination"]')
        .within(() => {
          cy.get(".parameter__name.required").should("exist")
        })
    })

    it("should display optional header parameter", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get('tr[data-param-name="Overwrite"]')
        .should("exist")
        .within(() => {
          cy.get(".parameter__name").should("not.have.class", "required")
        })
    })
  })

  describe("Request Body", () => {
    it("should display request body for LOCK operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-lockDocument")
        .click()
        .get(".opblock-section-request-body")
        .should("exist")
    })

    it("should show XML content type for LOCK operation", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-lockDocument")
        .click()
        .get(".opblock-section-request-body")
        .within(() => {
          cy.contains("application/xml").should("exist")
        })
    })
  })

  describe("Responses", () => {
    it("should display response section", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get(".responses-wrapper")
        .should("exist")
    })

    it("should display multiple response codes", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get(".responses-wrapper")
        .within(() => {
          cy.contains("201").should("exist")
          cy.contains("204").should("exist")
          cy.contains("412").should("exist")
        })
    })

    it("should display response headers", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get(".responses-wrapper")
        .within(() => {
          cy.contains("Location").should("exist")
        })
    })
  })

  describe("Try It Out Disabled", () => {
    it("should not show Try It Out button for additional operations", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .click()
        .get(".try-out__btn")
        .should("not.exist")
    })

    it("should not allow executing additional operations", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-lockDocument")
        .click()
        .get(".execute-wrapper")
        .should("not.exist")
    })
  })

  describe("Mixed Operations on Same Path", () => {
    it("should render both standard and additional operations for same path", () => {
      cy.visit(baseUrl)

      // Standard operations
      cy.get("#operations-Documents-getDocument").should("exist")
      cy.get("#operations-Documents-updateDocument").should("exist")
      cy.get("#operations-Documents-deleteDocument").should("exist")

      // Additional operations
      cy.get("#operations-additional-operations-copyDocument").should("exist")
      cy.get("#operations-additional-operations-moveDocument").should("exist")
      cy.get("#operations-additional-operations-lockDocument").should("exist")
      cy.get("#operations-additional-operations-unlockDocument").should("exist")
    })

    it("should separate standard operations from additional operations", () => {
      cy.visit(baseUrl)

      // Standard operations should be in operations section
      cy.get(".opblock-tag-section").contains("Documents").should("exist")

      // Additional operations should be in their own section
      cy.get(".additional-operations").should("exist")
    })
  })

  describe("Multiple Paths with additionalOperations", () => {
    it("should render additionalOperations from multiple paths", () => {
      cy.visit(baseUrl)

      // From /documents/{documentId}
      cy.get("#operations-additional-operations-copyDocument").should("exist")
      cy.get("#operations-additional-operations-moveDocument").should("exist")

      // From /collections/{collectionId}
      cy.get(
        "#operations-additional-operations-findCollectionProperties"
      ).should("exist")
      cy.get(
        "#operations-additional-operations-patchCollectionProperties"
      ).should("exist")
      cy.get("#operations-additional-operations-makeCollection").should("exist")

      // From /search
      cy.get("#operations-additional-operations-searchCustom").should("exist")
    })
  })

  describe("Custom Method Case Handling", () => {
    it("should preserve uppercase method names in display", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .within(() => {
          cy.get(".opblock-summary-method").should("contain.text", "COPY")
        })
    })

    it("should apply lowercase class names for styling", () => {
      cy.visit(baseUrl)
        .get("#operations-additional-operations-copyDocument")
        .should("have.class", "opblock-copy")
    })
  })

  describe("Coexistence with QUERY Method", () => {
    it("should render both QUERY and custom SEARCH methods", () => {
      cy.visit(baseUrl)

      // QUERY method (standard in OAS 3.2)
      cy.get("#operations-Search-searchQuery").should("exist")

      // Custom SEARCH method (in additionalOperations)
      cy.get("#operations-additional-operations-searchCustom").should("exist")
    })

    it("should distinguish between QUERY and custom SEARCH", () => {
      cy.visit(baseUrl)

      // QUERY should be in operations section
      cy.get("#operations-Search-searchQuery")
        .should("exist")
        .should("have.class", "opblock-query")

      // Custom SEARCH should be in additional operations section
      cy.get(".additional-operations")
        .find("#operations-additional-operations-searchCustom")
        .should("exist")
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
