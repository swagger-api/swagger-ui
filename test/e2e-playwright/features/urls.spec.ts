/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../support/fixtures"

// Swagger UI exposes its instance as `window.ui` in the test pages.
const getSpecUrl = (page: Page) =>
  page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped app global
    return (window as any).ui.specSelectors.url() as string
  })

test.describe("configuration options: `urls` and `urls.primaryName`", () => {
  test.describe("`urls` only", () => {
    test("should render a list of URLs correctly", async ({ page }) => {
      await page.goto("/?configUrl=/configs/urls.yaml")
      await expect(page.locator("select > *")).toHaveCount(2)
      const options = page.locator("select > option")
      await expect(options.nth(0)).toHaveText("One")
      await expect(options.nth(0)).toHaveAttribute(
        "value",
        /\/documents\/features\/urls\/1\.yaml$/
      )
      await expect(options.nth(1)).toHaveText("Two")
      await expect(options.nth(1)).toHaveAttribute(
        "value",
        /\/documents\/features\/urls\/2\.yaml$/
      )
    })

    test("should render the first URL in the list", async ({ page }) => {
      await page.goto("/?configUrl=/configs/urls.yaml")
      await expect(page.locator("h1.title")).toHaveText("OneOAS 2.0")
      await expect
        .poll(() => getSpecUrl(page))
        .toMatch(/\/documents\/features\/urls\/1\.yaml$/)
    })
  })

  test("should respect a `urls.primaryName`", async ({ page }) => {
    await page.goto("/?configUrl=/configs/urls-primary-name.yaml")
    await expect(page.locator("select")).toHaveValue(
      /\/documents\/features\/urls\/2\.yaml/
    )
    await expect(page.locator("h1.title")).toHaveText("TwoOAS 3.0")
    // the original read `win.ui.specSelectors.url()` without asserting on it
    await expect(page.locator("select")).toHaveValue(
      /\/documents\/features\/urls\/2\.yaml/
    )
  })
})

test.describe("urls with server variables", () => {
  const configUrl = "/?configUrl=/configs/urls-server-variables.yaml"

  test("should compute a url and default server variables", async ({
    page,
  }) => {
    await page.goto(configUrl)
    await expect(page.locator("code")).toHaveText(
      "https://localhost:3200/oneFirstUrl"
    )
    await expect(page.locator("tr > :nth-child(1)")).toHaveText("basePath")
    await expect(page.locator("input")).toHaveValue("/oneFirstUrl")
  })
  test("should change server variables", async ({ page }) => {
    await page.goto(configUrl)
    await expect(page.locator("code")).toHaveText(
      "https://localhost:3200/oneFirstUrl"
    )
    await expect(page.locator("tr > :nth-child(1)")).toHaveText("basePath")
    await expect(page.locator("input")).toHaveValue("/oneFirstUrl")
    await page
      .locator(".servers > label > select")
      .nth(0)
      .selectOption({ index: 1 })
    await expect(page.locator("input")).toHaveValue("/oneSecondUrl")
  })
  test("should select and compute second url", async ({ page }) => {
    await page.goto(configUrl)
    await expect(page.locator("select > option").nth(1)).toHaveText("Two")
    await page.locator("select").nth(0).selectOption({ index: 1 })
    await expect(page.locator("code")).toHaveText(
      "https://localhost:3200/twoFirstUrl"
    )
    await expect(page.locator("input")).toHaveValue("/twoFirstUrl")
  })
  test("should select second url, then toggle back to first url", async ({
    page,
  }) => {
    await page.goto(configUrl)
    await page.locator("select").nth(0).selectOption({ index: 1 })
    await expect(page.locator("input")).toHaveValue("/twoFirstUrl")
    // toggle url back
    await page.locator("select").nth(0).selectOption({ index: 0 })
    await expect(page.locator("code")).toHaveText(
      "https://localhost:3200/oneFirstUrl"
    )
    await expect(page.locator("input")).toHaveValue("/oneFirstUrl")
  })
  test("should change server variables, then select second url, and maintain server variables index", async ({
    page,
  }) => {
    await page.goto(configUrl)
    await page
      .locator(".servers > label >select")
      .nth(0)
      .selectOption({ index: 1 })
    await expect(page.locator("input")).toHaveValue("/oneSecondUrl")
    // change url
    await page.locator("select").nth(0).selectOption({ index: 1 })
    await expect(page.locator("input")).toHaveValue("/twoSecondUrl")
    await expect(page.locator("input")).toHaveValue("/twoSecondUrl")
  })
})
