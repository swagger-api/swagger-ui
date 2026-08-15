/**
 * @prettier
 */

describe("OpenAPI 3.0 Request Body description on file upload content types", () => {
  beforeEach(() => {
    cy.visit(
      "/?url=/documents/features/oas3-request-body-file-upload-description.yaml"
    )
  })

  describe("application/octet-stream (with schema)", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadApplicationOctetStream").click()
    })

    it("renders the Markdown description before Try it out is enabled", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Upload a binary blob")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown strong"
      ).should("have.text", "Upload a binary blob")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/octet-stream media types."
      )
    })

    it("renders the Markdown description after Try it out is enabled", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Upload a binary blob")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("image/png", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadImagePng").click()
    })

    it("renders the Markdown description before Try it out is enabled", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Upload a PNG image")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown em"
      ).should("have.text", "Upload a PNG image")
    })

    it("renders the Markdown description after Try it out is enabled", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Upload a PNG image")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("application/octet-stream with empty Media Type Object", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadApplicationOctetStreamEmpty").click()
    })

    it("renders the Markdown description before Try it out is enabled", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Empty media type object")
    })

    it("renders the Markdown description after Try it out is enabled", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "Empty media type object")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("schema type string and format binary", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaFormatBinary").click()
    })

    it("renders the Markdown description before Try it out is enabled", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "application/x-custom")
    })

    it("renders the Markdown description after Try it out is enabled", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      )
        .should("exist")
        .and("contain.text", "application/x-custom")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("file upload without a requestBody description", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadWithoutDescription").click()
    })

    it("does not render a Markdown block when description is absent (before Try it out)", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      ).should("not.exist")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/octet-stream media types."
      )
    })

    it("does not render a Markdown block when description is absent (after Try it out)", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper .renderedMarkdown"
      ).should("not.exist")
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })
})
