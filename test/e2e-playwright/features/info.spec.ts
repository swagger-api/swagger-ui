/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Render Info Component", () => {
  test.describe("OpenAPI 2.0", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI2.yaml"

    test("should render Info Description", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".info .description")).toContainText(
        "This is a sample"
      )
    })

    test("should render Info Main anchor target xss link with safe `rel` attributes", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const anchor = page.locator(".info .main > a")
      await expect(anchor).toHaveAttribute("rel", /noopener/)
      await expect(anchor).toHaveAttribute("rel", /noreferrer/)
      await expect(anchor).toHaveAttribute("target", "_blank")
    })

    test("should not render Info Summary (an OpenAPI 3.1 field)", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".info__summary")).toHaveCount(0)
    })
  })

  test.describe("OpenAPI 3.0.x", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI30.yaml"

    test("should render Info Description", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".info .description")).toContainText(
        "This is a sample"
      )
    })

    test("should render Info Main anchor target xss link with safe `rel` attributes", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const anchor = page.locator(".info .main > a")
      await expect(anchor).toHaveAttribute("rel", /noopener/)
      await expect(anchor).toHaveAttribute("rel", /noreferrer/)
      await expect(anchor).toHaveAttribute("target", "_blank")
    })

    // FIXME: info-openAPI30.yaml declares `openapi: 3.1.0`, so the summary IS
    // rendered. The Cypress version only passed because `not.exist` was checked
    // before the spec had rendered (vacuous pass). Needs a fixture fix (3.0.x).
    test.fixme(
      "should not render Info Summary (an OpenAPI 3.1 field)",
      async ({ page }) => {
        await page.goto(baseUrl)
        await expect(page.locator(".info__summary")).toHaveCount(0)
      }
    )
  })

  test.describe("OpenAPI 3.1.x", () => {
    const baseUrl = "/?url=/documents/features/info-openAPI31.yaml"

    test("should render Info Description", async ({ page }) => {
      await page.goto(baseUrl)
      await expect(page.locator(".info .description")).toContainText(
        "This is a sample"
      )
    })

    test("should render Info Main anchor target xss link with safe `rel` attributes", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const anchor = page.locator(".info .main > a")
      await expect(anchor).toHaveAttribute("rel", /noopener/)
      await expect(anchor).toHaveAttribute("rel", /noreferrer/)
      await expect(anchor).toHaveAttribute("target", "_blank")
    })

    test("should render Info Summary", async ({ page }) => {
      await page.goto(baseUrl)
      const summary = page.locator(".info__summary")
      await expect(summary).toBeAttached()
      await expect(summary).toContainText("new 3.1.x specific field")
      await expect(page.locator(".info .description")).toContainText(
        "This is a sample"
      )
    })
  })
})
