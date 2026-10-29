/**
 * @prettier
 */
import { test, expect } from "../../../support/fixtures"
import type { Page } from "@playwright/test"

test.describe("OpenAPI 3.1 Request Body upload file button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "/?url=/documents/features/oas31-request-body-upload-file.yaml"
    )
  })

  test.describe("application/octet-stream", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadApplicationOctetStream")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/octet-stream media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("image/png", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("#operations-default-uploadImagePng").click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for image/png media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("audio/wav", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("#operations-default-uploadAudioWav").click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for audio/wav media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("video/mpeg", () => {
    test.beforeEach(async ({ page }) => {
      await page.locator("#operations-default-uploadVideoMpeg").click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for video/mpeg media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("application/octet-stream with empty Media Type Object", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadApplicationOctetStreamEmpty")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/octet-stream media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema type string and format binary", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaTypeFormatBinary")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema type string and format byte", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaTypeFormatByte")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema union type includes string and format binary", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaUnionTypeFormatBinary")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema union type includes string and format byte", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaUnionTypeFormatByte")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema contentMediaType is a non-empty string", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaContentMediaType")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("schema contentEncoding is a non-empty string", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadSchemaContentEncoding")
        .click()
    })

    test("should display description with the correct content type", async ({
      page,
    }) => {
      await expect(
        page.locator(
          ".opblock-section-request-body .opblock-description-wrapper i"
        )
      ).toHaveText(
        "Example values are not available for application/x-custom media types."
      )
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property with schema type string and format binary", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadPropertySchemaFormatBinary")
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property with schema type string and format byte", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadPropertySchemaFormatByte")
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property with schema union type including string and format binary", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator(
          "#operations-default-uploadPropertySchemaUnionTypeFormatBinary"
        )
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property with schema union type including string and format byte", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadPropertySchemaUnionTypeFormatByte")
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property schema has contentMediaType with non-empty string", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadPropertySchemaContentMediaType")
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })

  test.describe("multipart/form-data object property schema has contentEncoding with non-empty string", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("#operations-default-uploadPropertySchemaContentEncoding")
        .click()
    })

    test("should display a file upload button", async ({ page, swaggerUi }) => {
      await swaggerUi.tryItOut()
      await expectFileInput(page)
    })
  })
})

async function expectFileInput(page: Page) {
  // Cypress `have.prop` reads the first matched element; the wrapper may also
  // hold a "Send empty value" checkbox, so target the first input explicitly.
  await expect(
    page
      .locator(
        ".opblock-section-request-body .opblock-description-wrapper input"
      )
      .first()
  ).toHaveJSProperty("type", "file")
}
