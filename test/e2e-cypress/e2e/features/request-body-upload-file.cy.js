/**
 * @prettier
 */

describe("OpenAPI 3.0 Request Body upload file button", () => {
  describe("application/octet-stream", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadApplicationOctetStream")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for application/octet-stream media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadApplicationOctetStream")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
  describe("image/png", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadImagePng")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for image/png media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadApplicationOctetStream")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
  describe("audio/wav", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadAudioWav")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for audio/wav media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadApplicationOctetStream")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
  describe("video/mpeg", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadVideoMpeg")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for video/mpeg media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadApplicationOctetStream")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
  describe("schema format binary", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadSchemaFormatBinary")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for application/x-custom media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadSchemaFormatBinary")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
  describe("schema format base64", () => {
    it("should display description with the correct content type", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadSchemaFormatBase64")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper i")
        .should(
          "have.text",
          "Example values are not available for application/x-custom media types."
        )
    })
    it("should display a file upload button", () => {
      cy.visit("/?url=/documents/features/request-body-upload-file.yaml")
        .get("#operations-default-uploadSchemaFormatBinary")
        .click()
        .get(".try-out__btn")
        .click()
        .get(".opblock-section-request-body .opblock-description-wrapper input")
        .should("have.prop", "type", "file")
    })
  })
})
