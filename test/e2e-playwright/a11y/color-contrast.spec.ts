/**
 * @prettier
 */
import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"

import { test, expect } from "../support/fixtures"

const runA11y = (page: Page) =>
  new AxeBuilder({ page })
    .options({ resultTypes: ["violations"] })
    .withTags(["wcag2a", "wcag2aa", "section508"])
    .withRules(["color-contrast"])
    .analyze()
    .then(({ violations }) => {
      if (violations.length > 0) {
        const conciseViolations = violations.reduce(
          (all, violations) =>
            violations.nodes.reduce(
              (acc, { failureSummary, html }) =>
                `${acc}\nFailure:\n${failureSummary}\n${html}`,
              all
            ),
          `Failures:`
        )

        expect(conciseViolations).toEqual("")
      }
    })

const recursiveClick = async (page: Page, locator: string, maxPasses = 20) => {
  const collapsed = page.locator(locator)

  for (let pass = 0; pass < maxPasses; pass++) {
    try {
      // returns immediately when there is work; only waits when idle
      await collapsed.first().waitFor({ state: "attached", timeout: 500 })
    } catch {
      break
    }
    // one browser round trip per nesting level, not one per toggle
    await collapsed.evaluateAll((els) =>
      els.forEach((el) => (el as HTMLElement).click())
    )
  }

  await expect(collapsed).toHaveCount(0) // fail loudly if the cap was hit
}

const expandAllModels = async (page: Page) => {
  const section = page.locator("section.models")
  await expect(section).toBeVisible()
  await recursiveClick(page, '.model-box-control[aria-expanded="false"]')
}

const tryOutAllSchemas = async (page: Page) => {
  await recursiveClick(page, ".try-out__btn:not(.cancel)")
}

const openOneOfEachHttpMethod = async (page: Page) => {
  await page.locator(".opblock-post").first().click()
  await page.locator(".opblock-put").first().click()
  await page.locator(".opblock-get").first().click()
  await page.locator(".opblock-delete").first().click()
  await page.locator(".opblock-deprecated").first().click()
}

// axe reads half-transparent text mid-animation (e.g. .errors-wrapper's scaleUp
// fade-in) and reports a blended, too-low contrast. Looping animations are
// skipped because they never finish.
const waitForAnimations = (page: Page) =>
  page.evaluate(() =>
    Promise.allSettled(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished)
    )
  )

test.describe("Color contrast in light mode", () => {
  test("passes a11y checks", async ({ page }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    return runA11y(page)
  })

  test("authorization popup passes a11y checks", async ({ page }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await page.locator("button.btn.authorize").click()
    await expect(page.locator(".dialog-ux")).toBeAttached()
    return runA11y(page)
  })

  test("passes a11y checks with all schemas open", async ({ page }) => {
    await page.goto(
      "/?url=/documents/petstore.swagger.yaml&docExpansion=full&defaultModelRendering=model&defaultModelExpandDepth=100"
    )
    await expect(page.locator("#swagger-ui")).toBeAttached()
    return runA11y(page)
  })

  test("passes a11y checks with all models expanded", async ({ page }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await expandAllModels(page)
    return runA11y(page)
  })

  test("passes a11y checks when trying out each HTTP method", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await openOneOfEachHttpMethod(page)
    await tryOutAllSchemas(page)
    return runA11y(page)
  })

  test("passes a11y checks when there are errors executing each HTTP method", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await page.locator(".opblock-get").first().click()
    await page.locator(".opblock-deprecated").first().click()
    await page.locator(".opblock-delete").first().click()
    await page.locator("#operations-pet-updatePetWithForm").click()
    await page.locator("#operations-user-updateUser").click()
    await tryOutAllSchemas(page)
    for (const button of await page.locator("button.execute").all()) {
      await button.click()
    }
    await expect(page.locator(".validation-errors").first()).toBeVisible()
    await waitForAnimations(page)
    return runA11y(page)
  })
})

test.describe("Color contrast in dark mode", () => {
  test.use({ colorScheme: "dark" })

  test("passes a11y checks in dark mode", async ({ page }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    return runA11y(page)
  })

  test("authorization popup passes a11y checks in dark mode", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await page.locator("button.btn.authorize").click()
    await expect(page.locator(".dialog-ux")).toBeAttached()
    return runA11y(page)
  })

  test("passes a11y checks in dark mode with all schemas open", async ({
    page,
  }) => {
    await page.goto(
      "/?url=/documents/petstore.swagger.yaml&docExpansion=full&defaultModelRendering=model&defaultModelExpandDepth=100"
    )
    await expect(page.locator("#swagger-ui")).toBeAttached()
    return runA11y(page)
  })

  test("passes a11y checks in dark mode with all models expanded", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await expandAllModels(page)
    return runA11y(page)
  })

  test("passes a11y checks in dark mode when trying out each HTTP method", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await openOneOfEachHttpMethod(page)
    await tryOutAllSchemas(page)
    return runA11y(page)
  })

  test("passes a11y checks in dark mode when there are errors executing each HTTP method", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/petstore.swagger.yaml")
    await expect(page.locator("#swagger-ui")).toBeAttached()
    await page.locator(".opblock-get").first().click()
    await page.locator(".opblock-deprecated").first().click()
    await page.locator(".opblock-delete").first().click()
    await page.locator("#operations-pet-updatePetWithForm").click()
    await page.locator("#operations-user-updateUser").click()
    await tryOutAllSchemas(page)
    for (const button of await page.locator("button.execute").all()) {
      await button.click()
    }
    await expect(page.locator(".validation-errors").first()).toBeVisible()
    await waitForAnimations(page)
    return runA11y(page)
  })
})
