/**
 * @prettier
 */
describe("OAS 3.2 Media Types Support", () => {
  const baseUrl = "/?url=/documents/features/oas32-media-types.yaml"

  describe("Media Types Section", () => {
    it("should render Media Types section", () => {
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
  })

  describe("Media Type Entries", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should render JsonUser media type", () => {
      cy.get('[data-name="JsonUser"]').should("exist")
    })

    it("should render EventStream media type", () => {
      cy.get('[data-name="EventStream"]').should("exist")
    })

    it("should render JsonLinesFeed media type", () => {
      cy.get('[data-name="JsonLinesFeed"]').should("exist")
    })

    it("should render JsonProduct media type", () => {
      cy.get('[data-name="JsonProduct"]').should("exist")
    })

    it("should render XmlProduct media type", () => {
      cy.get('[data-name="XmlProduct"]').should("exist")
    })

    it("should display media type names", () => {
      cy.get(".media-type-name").first().should("exist").should("be.visible")
    })
  })

  describe("Media Type Details", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should expand media type when clicked", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-details")
        .should("be.visible")
    })

    it("should display schema section", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-section")
        .contains("Schema")
        .should("exist")
    })

    it("should display schema JSON", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-schema pre code")
        .should("exist")
        .should("contain.text", "properties")
    })

    it("should display examples section", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-section")
        .contains("Examples")
        .should("exist")
    })

    it("should display multiple examples", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-example")
        .should("have.length", 2)
    })

    it("should display example summary", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-example")
        .first()
        .should("contain.text", "default")
    })

    it("should display example value", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-example pre code")
        .first()
        .should("contain.text", "johndoe")
    })
  })

  describe("Media Type with Encoding", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should display encoding section", () => {
      cy.get('[data-name="JsonProduct"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonProduct"]')
        .find(".media-type-section")
        .contains("Encoding")
        .should("exist")
    })

    it("should display encoding JSON", () => {
      cy.get('[data-name="JsonProduct"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonProduct"]')
        .find(".media-type-encoding pre code")
        .should("exist")
        .should("contain.text", "tags")
    })
  })

  describe("Item Schema Support (OAS 3.2)", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should display itemSchema section for EventStream", () => {
      cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

      cy.get('[data-name="EventStream"]')
        .find(".media-type-item-schema")
        .should("exist")
    })

    it("should display streaming badge for itemSchema", () => {
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

    it("should display itemSchema JSON", () => {
      cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

      cy.get('[data-name="EventStream"]')
        .find(".media-type-item-schema pre code")
        .should("exist")
        .should("contain.text", "properties")
    })

    it("should display itemSchema for JsonLinesFeed", () => {
      cy.get('[data-name="JsonLinesFeed"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonLinesFeed"]')
        .find(".media-type-item-schema")
        .should("exist")
    })

    it("should display itemSchema for StreamingMetrics", () => {
      cy.get('[data-name="StreamingMetrics"]')
        .find(".media-type-toggle")
        .click()

      cy.get('[data-name="StreamingMetrics"]')
        .find(".media-type-item-schema")
        .should("exist")
    })
  })

  describe("Item Schema Styling", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should apply special background color to itemSchema section", () => {
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

    it("should apply border to itemSchema section", () => {
      cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

      cy.get('[data-name="EventStream"]')
        .find(".media-type-item-schema")
        .should("have.css", "border")
    })
  })

  describe("Media Types Referencing in Operations", () => {
    it("should reference JsonUser in request body", () => {
      cy.visit(baseUrl).get("#operations-Users-createUser").click()

      // Should show request body with reference to JsonUser
      cy.get(".opblock-section-request-body").should("exist")
    })

    it("should reference EventStream in response", () => {
      cy.visit(baseUrl).get("#operations-Events-streamEvents").click()

      // Should show response with reference to EventStream
      cy.get(".responses-wrapper").should("exist")
    })
  })

  describe("Multiple Media Types", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should display all defined media types", () => {
      cy.get(".media-type-container").should("have.length.at.least", 5)
    })

    it("should allow expanding multiple media types simultaneously", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-details")
        .should("be.visible")

      cy.get('[data-name="EventStream"]')
        .find(".media-type-details")
        .should("be.visible")
    })
  })

  describe("Media Type Container Styling", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should apply border to media type containers", () => {
      cy.get(".media-type-container").first().should("have.css", "border")
    })

    it("should apply background color to media type containers", () => {
      cy.get(".media-type-container")
        .first()
        .should("have.css", "background-color")
    })

    it("should apply border radius to media type containers", () => {
      cy.get(".media-type-container")
        .first()
        .should("have.css", "border-radius")
    })
  })

  describe("Streaming Media Types", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should identify text/event-stream media type with itemSchema", () => {
      cy.get('[data-name="EventStream"]').find(".media-type-toggle").click()

      cy.get('[data-name="EventStream"]')
        .find(".streaming-badge")
        .should("exist")
    })

    it("should identify application/jsonl media type with itemSchema", () => {
      cy.get('[data-name="JsonLinesFeed"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonLinesFeed"]')
        .find(".streaming-badge")
        .should("exist")
    })
  })

  describe("Complex Examples", () => {
    beforeEach(() => {
      cy.visit(baseUrl).get(".media-types-control").click()
    })

    it("should display example with summary and description", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-example")
        .first()
        .within(() => {
          cy.get(".example-summary").should("exist")
          cy.get(".example-description").should("exist")
        })
    })

    it("should display minimal example", () => {
      cy.get('[data-name="JsonUser"]').find(".media-type-toggle").click()

      cy.get('[data-name="JsonUser"]')
        .find(".media-type-example")
        .eq(1)
        .should("contain.text", "minimal")
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
