/**
 * @prettier
 */

describe("OpenAPI 3.0 Request Body upload file button", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas3-request-body-upload-file.yaml")
  })

  describe("application/octet-stream", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadApplicationOctetStream").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/octet-stream media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("image/png", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadImagePng").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for image/png media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("audio/wav", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadAudioWav").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for audio/wav media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("video/mpeg", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadVideoMpeg").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for video/mpeg media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("application/octet-stream with empty Media Type Object", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadApplicationOctetStreamEmpty").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/octet-stream media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("schema type string and format binary", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaFormatBinary").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/x-custom media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("schema type string and format byte", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaFormatByte").click()
    })

    it("should display description with the correct content type", () => {
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper i"
      ).should(
        "have.text",
        "Example values are not available for application/x-custom media types."
      )
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("multipart/form-data object property with schema type string and format binary", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadPropertySchemaFormatBinary").click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("multipart/form-data object property with schema type string and format byte", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadPropertySchemaFormatByte").click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })
})
