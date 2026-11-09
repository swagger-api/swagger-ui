/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

type SwaggerUIWindow = Window & {
  SwaggerUIBundle: ((config: Record<string, unknown>) => unknown) & {
    presets: { apis: unknown }
  }
  ui: {
    specActions: { updateJsonSpec: (json: unknown) => void }
    specSelectors: { specJS: () => unknown }
  }
}

test.describe("resolving operation subtrees", () => {
  test("two instances on one page each resolve their own operations", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
    await expect(page.locator("#swagger-ui .opblock").first()).toBeVisible()

    await page.evaluate(() => {
      const w = window as unknown as SwaggerUIWindow
      const container = document.createElement("div")
      container.id = "swagger-ui-second"
      document.body.appendChild(container)
      w.SwaggerUIBundle({
        url: "/documents/petstore.swagger.yaml",
        dom_id: "#swagger-ui-second",
        presets: [w.SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
      })
    })

    for (const container of ["#swagger-ui", "#swagger-ui-second"]) {
      const operation = page.locator(`${container} .opblock`).first()
      await expect(operation).toBeVisible()
      await operation.locator(".opblock-summary-control").click()
      await expect(operation.locator(".opblock-body")).toBeVisible()
      await expect(operation.locator(".opblock-body .parameters")).toBeVisible()
    }
  })

  test("an operation still resolves after the document was replaced", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore-expanded.openapi.yaml")
    await expect(page.locator("#swagger-ui .opblock").first()).toBeVisible()

    await page.evaluate(() => {
      const { ui } = window as unknown as SwaggerUIWindow
      ui.specActions.updateJsonSpec(ui.specSelectors.specJS())
    })

    const operation = page.locator("#swagger-ui .opblock").first()
    await operation.locator(".opblock-summary-control").click()
    await expect(operation.locator(".opblock-body .parameters")).toBeVisible()
  })
})
