/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"

const description = ".opblock-section-request-body .opblock-description-wrapper"

interface UploadFileOptions {
  title: string
  operationDomId: string
  // omitted for the multipart property cases, which have no description test
  descriptionText?: string
}

function uploadFileTestFactory({
  title,
  operationDomId,
  descriptionText,
}: UploadFileOptions): void {
  test.describe(title, () => {
    test.beforeEach(async ({ page, swaggerUi }) => {
      await page.goto(
        "/?url=/documents/features/oas3-request-body-upload-file.yaml"
      )
      await swaggerUi.toggleOperation(`#operations-default-${operationDomId}`)
    })

    if (descriptionText !== undefined) {
      test("should display description with the correct content type", async ({
        page,
      }) => {
        await expect(page.locator(`${description} i`)).toHaveText(
          descriptionText
        )
      })
    }

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      // cy `have.prop` reads the first matched element (a "Send empty value" checkbox may follow it)
      await expect(
        page.locator(`${description} input`).first()
      ).toHaveJSProperty("type", "file")
    })
  })
}

test.describe("OpenAPI 3.0 Request Body upload file button", () => {
  uploadFileTestFactory({
    title: "application/octet-stream",
    operationDomId: "uploadApplicationOctetStream",
    descriptionText:
      "Example values are not available for application/octet-stream media types.",
  })
  uploadFileTestFactory({
    title: "image/png",
    operationDomId: "uploadImagePng",
    descriptionText:
      "Example values are not available for image/png media types.",
  })
  uploadFileTestFactory({
    title: "audio/wav",
    operationDomId: "uploadAudioWav",
    descriptionText:
      "Example values are not available for audio/wav media types.",
  })
  uploadFileTestFactory({
    title: "video/mpeg",
    operationDomId: "uploadVideoMpeg",
    descriptionText:
      "Example values are not available for video/mpeg media types.",
  })
  uploadFileTestFactory({
    title: "application/octet-stream with empty Media Type Object",
    operationDomId: "uploadApplicationOctetStreamEmpty",
    descriptionText:
      "Example values are not available for application/octet-stream media types.",
  })
  uploadFileTestFactory({
    title: "schema type string and format binary",
    operationDomId: "uploadSchemaFormatBinary",
    descriptionText:
      "Example values are not available for application/x-custom media types.",
  })
  uploadFileTestFactory({
    title: "schema type string and format byte",
    operationDomId: "uploadSchemaFormatByte",
    descriptionText:
      "Example values are not available for application/x-custom media types.",
  })
  uploadFileTestFactory({
    title:
      "multipart/form-data object property with schema type string and format binary",
    operationDomId: "uploadPropertySchemaFormatBinary",
  })
  uploadFileTestFactory({
    title:
      "multipart/form-data object property with schema type string and format byte",
    operationDomId: "uploadPropertySchemaFormatByte",
  })
})
