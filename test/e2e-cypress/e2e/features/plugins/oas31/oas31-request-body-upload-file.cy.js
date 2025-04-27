/**
 * @prettier
 */

describe("OpenAPI 3.1 Request Body upload file button", () => {
  beforeEach(() => {
    cy.visit("/?url=/documents/features/oas31-request-body-upload-file.yaml")
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
      cy.get("#operations-default-uploadSchemaTypeFormatBinary").click()
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
      cy.get("#operations-default-uploadSchemaTypeFormatByte").click()
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

  describe("schema union type includes string and format binary", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaUnionTypeFormatBinary").click()
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

  describe("schema union type includes string and format byte", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaUnionTypeFormatByte").click()
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

  describe("schema contentMediaType is a non-empty string", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaContentMediaType").click()
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

  describe("schema contentEncoding is a non-empty string", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadSchemaContentEncoding").click()
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

  describe("multipart/form-data object property with schema union type including string and format binary", () => {
    beforeEach(() => {
      cy.get(
        "#operations-default-uploadPropertySchemaUnionTypeFormatBinary"
      ).click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("multipart/form-data object property with schema union type including string and format byte", () => {
    beforeEach(() => {
      cy.get(
        "#operations-default-uploadPropertySchemaUnionTypeFormatByte"
      ).click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("multipart/form-data object property schema has contentMediaType with non-empty string", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadPropertySchemaContentMediaType").click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })

  describe("multipart/form-data object property schema has contentEncoding with non-empty string", () => {
    beforeEach(() => {
      cy.get("#operations-default-uploadPropertySchemaContentEncoding").click()
    })

    it("should display a file upload button", () => {
      cy.get(".try-out__btn").click()
      cy.get(
        ".opblock-section-request-body .opblock-description-wrapper input"
      ).should("have.prop", "type", "file")
    })
  })
})
