/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

for (const version of ["3.0.4", "3.1.1"]) {
  test.describe(`Parameter placeholders (OpenAPI ${version})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.route(
        "**/documents/features/parameter-placeholder.yaml",
        async (route) => {
          const response = await route.fetch()
          const body = (await response.text()).replace(
            "openapi: 3.0.4",
            `openapi: ${version}`
          )
          await route.fulfill({ response, body })
        }
      )
      await page.route("**/placeholder-clients*", async (route) => {
        await route.fulfill({ json: [] })
      })
      await page.goto("/?url=/documents/features/parameter-placeholder.yaml")
    })

    test("shows hints without submitting them and preserves examples and defaults", async ({
      page,
      swaggerUi,
    }) => {
      await swaggerUi.toggleOperation("#operations-default-listClients")
      await swaggerUi.tryItOut()

      const input = page.locator('[data-param-name="clientId"] input')
      await expect(input).toHaveAttribute("placeholder", "1")
      await expect(input).toHaveValue("")
      await expect(
        page.locator('[data-param-name="ordinary"] input')
      ).toHaveAttribute("placeholder", "ordinary")
      await expect(
        page.locator('[data-param-name="withExample"] input')
      ).toHaveValue("2")
      await expect(
        page.locator('[data-param-name="withDefault"] input')
      ).toHaveValue("3")
      await expect(
        page.locator('[data-param-name="status"] select')
      ).toBeVisible()

      // Check the actual request for an untouched, edited, and cleared input.
      for (const value of ["", "42", ""]) {
        await input.fill(value)
        await input.blur()
        const requestSent = page.waitForRequest(
          (request) =>
            new URL(request.url()).pathname === "/placeholder-clients"
        )
        await swaggerUi.execute()
        const request = await requestSent
        const query = new URL(request.url()).searchParams

        expect(query.get("clientId")).toBe(value || null)
        expect(query.get("withExample")).toBe("2")
        expect(query.get("withDefault")).toBe("3")
        expect(query.has("ordinary")).toBe(false)
        expect(query.has("status")).toBe(false)
        await expect(swaggerUi.executeButton).toBeEnabled()
      }
    })

    test("does not satisfy required parameter validation", async ({
      page,
      swaggerUi,
    }) => {
      const requests: string[] = []
      await page.route("**/placeholder-required*", async (route) => {
        requests.push(route.request().url())
        await route.fulfill({ json: {} })
      })
      await swaggerUi.toggleOperation("#operations-default-requiredClient")
      await swaggerUi.tryItOut()
      await swaggerUi.execute()

      const input = page.locator('[data-param-name="clientId"] input')
      await expect(input).toHaveValue("")
      await expect(input).toHaveAttribute("placeholder", "1")
      await expect(input).toHaveClass(/invalid/)
      expect(requests).toEqual([])
    })
  })
}
