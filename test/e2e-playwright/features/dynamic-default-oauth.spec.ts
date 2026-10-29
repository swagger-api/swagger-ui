/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

// the app exposes its system as `window.ui`
interface UiWindow {
  ui: { getConfigs: () => { oauth2RedirectUrl: string } }
}

test.describe("dynamic default oauth2RedirectUrl", () => {
  const oauth2RedirectUrl = (page: import("@playwright/test").Page) =>
    // only the one string is read; the full config holds functions that cannot be serialized
    page.evaluate(
      () => (window as unknown as UiWindow).ui.getConfigs().oauth2RedirectUrl
    )

  test("should compute an oauth2RedirectUrl based on the browser's location at runtime", async ({
    page,
  }) => {
    await page.goto("/")
    await expect
      .poll(() => oauth2RedirectUrl(page))
      .toBe("http://localhost:3230/oauth2-redirect.html")
  })
  test("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path", async ({
    page,
  }) => {
    await page.goto("/pages/5085/")
    await expect
      .poll(() => oauth2RedirectUrl(page))
      .toBe("http://localhost:3230/pages/5085/oauth2-redirect.html")
  })
  test("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path, without confusing the file name for a folder name", async ({
    page,
  }) => {
    await page.goto("/pages/5085/index.html")
    await expect
      .poll(() => oauth2RedirectUrl(page))
      .toBe("http://localhost:3230/pages/5085/oauth2-redirect.html")
  })
  test("should compute an oauth2RedirectUrl based on the browser's location at runtime, including the path, even it does not end with a slash", async ({
    page,
  }) => {
    await page.goto("/pages/5085")
    await expect
      .poll(() => oauth2RedirectUrl(page))
      .toBe("http://localhost:3230/pages/5085/oauth2-redirect.html")
  })
})
