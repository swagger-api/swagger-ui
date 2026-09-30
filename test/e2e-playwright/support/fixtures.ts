/**
 * @prettier
 */
import { test as base, expect } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

// Thin wrappers over selectors that 3+ specs repeat. Everything else stays
// as plain `page.locator(...)` in the specs so DOM selectors remain visible.
export class SwaggerUi {
  readonly page: Page
  readonly tryItOutButton: Locator
  readonly executeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.tryItOutButton = page.locator(".try-out__btn")
    this.executeButton = page.locator(".execute")
  }

  // expands (or collapses) an operation, e.g. "#operations-default-get_foo"
  async toggleOperation(selector: string): Promise<void> {
    await this.page.locator(selector).click()
  }

  async tryItOut(): Promise<void> {
    await this.tryItOutButton.click()
  }

  async execute(): Promise<void> {
    await this.executeButton.click()
  }
}

export const test = base.extend<{ swaggerUi: SwaggerUi }>({
  // Cypress ran with an `uncaught:exception` handler that returned `true`, i.e.
  // app exceptions were logged but never failed a test. Same here: log only.
  context: async ({ context }, use) => {
    context.on("weberror", (webError) => {
      console.error(
        `[pageerror] ${webError.page()?.url() ?? ""}`,
        webError.error()
      )
    })
    await use(context)
  },
  swaggerUi: async ({ page }, use) => {
    await use(new SwaggerUi(page))
  },
})

export { expect }
