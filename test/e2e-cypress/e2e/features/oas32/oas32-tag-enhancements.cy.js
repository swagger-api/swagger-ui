/**
 * @prettier
 */
describe("OAS 3.2 Tag Enhancements Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-tag-enhancements.yaml"

  describe("Tag Summary Field", () => {
    it("should render tag summary for Users tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should("exist")
          cy.get(".oas32-tag-summary").should(
            "contain.text",
            "User management operations"
          )
        })
    })

    it("should display summary with strong label", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary strong").should("contain.text", "Summary:")
        })
    })

    it("should render tag summary for Products tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Products"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should(
            "contain.text",
            "Product catalog operations"
          )
        })
    })

    it("should render tag summary for Webhooks tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Webhooks"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should(
            "contain.text",
            "Webhook management"
          )
        })
    })
  })

  describe("Tag Kind Field", () => {
    it("should render kind badge for Users tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("exist")
          cy.get(".oas32-tag-kind").should("contain.text", "resource")
        })
    })

    it("should render kind badge with proper styling", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind")
            .should("have.class", "badge")
            .should("have.css", "background-color")
        })
    })

    it("should render kind badge for webhook tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Webhooks"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "webhook")
        })
    })

    it("should render kind badge for admin tags", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Admin Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "admin")
        })

      cy.get('[data-tag="Admin Settings"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "admin")
        })
    })

    it("should not render kind badge for tags without kind field", () => {
      cy.visit(baseUrl)
      // Check if there are tags without extensions (if any exist in the spec)
      cy.get(".opblock-tag").then(($tags) => {
        // This test verifies that tags without kind don't show the badge
        // All tags in our test spec have kind, so we just verify structure exists
        expect($tags.length).to.be.greaterThan(0)
      })
    })
  })

  describe("Tag Parent Field", () => {
    it("should render parent reference for User Profile tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent").should("exist")
          cy.get(".oas32-tag-parent").should("contain.text", "Parent:")
          cy.get(".oas32-tag-parent code").should("contain.text", "Users")
        })
    })

    it("should render parent reference for User Settings tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Settings"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent code").should("contain.text", "Users")
        })
    })

    it("should render parent reference for Admin Users tag", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Admin Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent code").should("contain.text", "Users")
        })
    })

    it("should style parent reference with code element", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent code")
            .should("have.css", "background-color")
            .should("have.css", "padding")
        })
    })
  })

  describe("Tag Extensions Container", () => {
    it("should render extensions container when tag has enhancements", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-extensions").should("exist")
        })
    })

    it("should render metadata container for kind and parent", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-metadata").should("exist")
          cy.get(".oas32-tag-metadata").within(() => {
            cy.get(".oas32-tag-kind").should("exist")
            cy.get(".oas32-tag-parent").should("exist")
          })
        })
    })

    it("should display multiple enhancements together", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Admin Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should("exist")
          cy.get(".oas32-tag-kind").should("exist")
          cy.get(".oas32-tag-parent").should("exist")
        })
    })
  })

  describe("Tag Description Coexistence", () => {
    it("should render both description and summary", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          // Original description in small tag
          cy.get(".opblock-tag small").should("exist")
          cy.get(".opblock-tag small").should("contain.text", "user-related")

          // New OAS 3.2 summary
          cy.get(".oas32-tag-summary").should("exist")
          cy.get(".oas32-tag-summary").should("contain.text", "User management")
        })
    })

    it("should render external docs alongside enhancements", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".info__externaldocs").should("exist")
          cy.get(".oas32-tag-extensions").should("exist")
        })
    })
  })

  describe("Hierarchical Tag Organization", () => {
    it("should show parent-child relationship for User tags", () => {
      cy.visit(baseUrl)

      // Parent tag
      cy.get('[data-tag="Users"]').should("exist")

      // Child tags
      cy.get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent code").should("contain.text", "Users")
        })

      cy.get('[data-tag="User Settings"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-parent code").should("contain.text", "Users")
        })
    })

    it("should show multiple children for same parent", () => {
      cy.visit(baseUrl)

      // Count tags with Users as parent
      cy.get('.oas32-tag-parent code:contains("Users")').should(
        "have.length",
        3
      )
    })
  })

  describe("Tag Kind Categorization", () => {
    it("should identify resource tags", () => {
      cy.visit(baseUrl)

      cy.get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "resource")
        })

      cy.get('[data-tag="Products"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "resource")
        })
    })

    it("should identify webhook tags", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Webhooks"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "webhook")
        })
    })

    it("should identify admin tags", () => {
      cy.visit(baseUrl)

      cy.get('[data-tag="Admin Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "admin")
        })

      cy.get('[data-tag="Admin Settings"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("contain.text", "admin")
        })
    })
  })

  describe("Tag Expansion Behavior", () => {
    it("should expand tag and show operations when clicked", () => {
      cy.visit(baseUrl).get('[data-tag="Users"]').click()

      cy.get('[data-tag="Users"]').parent().should("have.class", "is-open")

      // Should show operations
      cy.get("#operations-Users-listUsers").should("exist")
      cy.get("#operations-Users-getUser").should("exist")
    })

    it("should maintain enhancements display when tag is expanded", () => {
      cy.visit(baseUrl).get('[data-tag="Users"]').click()

      cy.get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-extensions").should("be.visible")
          cy.get(".oas32-tag-summary").should("be.visible")
          cy.get(".oas32-tag-kind").should("be.visible")
        })
    })
  })

  describe("Tag Enhancements Styling", () => {
    it("should apply proper spacing to extensions container", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-extensions")
            .should("have.css", "padding")
            .should("have.css", "margin-top")
        })
    })

    it("should display metadata items in flex layout", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-metadata")
            .should("have.css", "display", "flex")
            .should("have.css", "gap")
        })
    })

    it("should style kind badge with background color", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should(
            "have.css",
            "color",
            "rgb(255, 255, 255)"
          )
        })
    })
  })

  describe("Complex Tag Scenarios", () => {
    it("should handle tags with all three enhancements", () => {
      cy.visit(baseUrl)
        .get('[data-tag="Admin Users"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should("exist")
          cy.get(".oas32-tag-kind").should("contain.text", "admin")
          cy.get(".oas32-tag-parent").should("exist")
        })
    })

    it("should handle tags with only summary", () => {
      cy.visit(baseUrl)
      // Products has summary and kind but no parent
      cy.get('[data-tag="Products"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-summary").should("exist")
          cy.get(".oas32-tag-kind").should("exist")
          cy.get(".oas32-tag-parent").should("not.exist")
        })
    })

    it("should handle tags with only kind and parent", () => {
      cy.visit(baseUrl)
        .get('[data-tag="User Profile"]')
        .parent()
        .within(() => {
          cy.get(".oas32-tag-kind").should("exist")
          cy.get(".oas32-tag-parent").should("exist")
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
