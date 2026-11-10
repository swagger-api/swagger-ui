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
  // Cypress's `uncaught:exception` handler returned `true`, and only a `false`
  // return suppresses the failure, so uncaught app exceptions failed the old
  // tests. Same here: collect them and fail the test during fixture teardown.
  context: async ({ context }, use) => {
    const errors: string[] = []
    context.on("weberror", (webError) => {
      const error = webError.error()
      console.error(`[pageerror] ${webError.page()?.url() ?? ""}`, error)
      errors.push(error.stack ?? error.message)
    })
    await use(context)
    expect(errors, "uncaught page exceptions").toEqual([])
  },
  swaggerUi: async ({ page }, use) => {
    await use(new SwaggerUi(page))
  },
})

export { expect }
