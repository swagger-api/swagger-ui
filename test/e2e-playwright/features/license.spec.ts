/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Render License Component", () => {
  test.describe("OpenAPI 2.0", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI2.yaml"

    test("should render License URL", async ({ page }) => {
      await page.goto(baseUrl)
      const license = page.locator(".info__license")
      await expect(license).toBeAttached()
      await expect(license).toContainText("Apache 2.0")
    })

    test("should render License URL anchor target xss link with safe `rel` attributes", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const link = page.locator(".info__license__url > .link")
      await expect(link).toHaveAttribute("rel", /noopener/)
      await expect(link).toHaveAttribute("rel", /noreferrer/)
      await expect(page.locator(".info .main > a")).toHaveAttribute(
        "target",
        "_blank"
      )
    })
  })

  test.describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/license-openAPI30.yaml"

    test("should render License URL", async ({ page }) => {
      await page.goto(baseUrl)
      const licenseUrl = page.locator(".info__license__url")
      await expect(licenseUrl).toBeAttached()
      await expect(licenseUrl).toContainText("Apache 2.0")
    })

    test("should render URL anchor target xss link with safe `rel` attributes", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const anchor = page.locator(".info__license__url > a")
      await expect(anchor).toHaveAttribute("rel", /noopener/)
      await expect(anchor).toHaveAttribute("rel", /noreferrer/)
      await expect(page.locator(".info .main > a")).toHaveAttribute(
        "target",
        "_blank"
      )
    })
  })

  test.describe("OpenAPI 3.1.x", () => {
    test.describe("given URL field", () => {
      const baseUrl = "/?url=/documents/features/license-openAPI31-url.yaml"

      test("should render URL", async ({ page }) => {
        await page.goto(baseUrl)
        const licenseUrl = page.locator(".info__license__url")
        await expect(licenseUrl).toBeAttached()
        await expect(licenseUrl).toContainText("Apache 2.0")
        await expect(page.locator(".info__license__url > a")).toHaveAttribute(
          "href",
          "https://www.apache.org/licenses/LICENSE-2.0.html"
        )
      })

      test("should render URL anchor target xss link with safe `rel` attributes", async ({
        page,
      }) => {
        await page.goto(baseUrl)
        const anchor = page.locator(".info__license__url > a")
        await expect(anchor).toHaveAttribute("rel", /noopener/)
        await expect(anchor).toHaveAttribute("rel", /noreferrer/)
        await expect(page.locator(".info .main > a")).toHaveAttribute(
          "target",
          "_blank"
        )
      })
    })

    test.describe("given identifier field", () => {
      const baseUrl =
        "/?url=/documents/features/license-openAPI31-identifier.yaml"

      test("should render URL using identifier", async ({ page }) => {
        await page.goto(baseUrl)
        const licenseUrl = page.locator(".info__license__url")
        await expect(licenseUrl).toBeAttached()
        await expect(licenseUrl).toContainText("Apache 2.0")
        await expect(page.locator(".info__license__url > a")).toHaveAttribute(
          "href",
          "https://spdx.org/licenses/Apache-2.0.html"
        )
      })

      test("should render URL anchor target xss links with safe `rel` attributes", async ({
        page,
      }) => {
        await page.goto(baseUrl)
        const anchor = page.locator(".info__license__url > a")
        await expect(anchor).toHaveAttribute("rel", /noopener/)
        await expect(anchor).toHaveAttribute("rel", /noreferrer/)
        await expect(page.locator(".info .main > a")).toHaveAttribute(
          "target",
          "_blank"
        )
      })
    })

    test.describe("URL and SPX are mutually exclusive", () => {
      // FIXME: the app renders `.info__license__url` when both url and
      // identifier are present. The Cypress version only passed because
      // `not.exist` was checked before the spec had rendered (vacuous pass).
      test.fixme(
        "should render nothing if both URL & SPDX exists",
        async ({ page }) => {
          const baseUrl =
            "/?url=/documents/features/license-openAPI31-error-both-identifier-and-url.yaml"
          await page.goto(baseUrl)
          await expect(page.locator(".info__license__identifier")).toHaveCount(
            0
          )
          await expect(page.locator(".info__license__url")).toHaveCount(0)
        }
      )
    })
  })
})
