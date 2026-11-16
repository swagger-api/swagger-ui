/**
 * @prettier
 */
import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"

import { test, expect } from "../support/fixtures"

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
  const expandDeepButtons = page.locator(
    ".json-schema-2020-12-expand-deep-button"
  )
  // isVisible()/count() do not wait, so first wait until either renderer has
  // rendered something to expand. Otherwise a late render picks the wrong branch.
  await expandDeepButtons
    .or(page.locator(".model-box-control"))
    .first()
    .waitFor({ state: "attached" })
  if ((await expandDeepButtons.count()) > 0) {
    const expand = page.locator(
      'button.json-schema-2020-12-expand-deep-button:text-is("Expand all")'
    )
    await expand.first().waitFor({ state: "attached" })
    await expand.evaluateAll((els) =>
      els.forEach((el) => (el as HTMLElement).click())
    )
    await expect(expand).toHaveCount(0)
  } else {
    await recursiveClick(page, '.model-box-control[aria-expanded="false"]')
  }
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

const tryOutAllSchemas = async (page: Page) => {
  await recursiveClick(page, ".try-out__btn:not(.cancel)")
}

// Opens and tries out the operations that are specific to the OAS 3.2 document:
// TRACE, QUERY, additionalOperations (COPY, PURGE) and webhooks.
const tryOutOAS32Operations = async (page: Page, path: string) => {
  await page.goto(`/?url=${path}`)
  await expect(page.locator("#swagger-ui")).toBeAttached()
  await page.locator(".opblock-trace").first().click()
  await page.locator(".opblock-query").first().click()
  await page.locator("#operations-pets-copyPet").click()
  await page.locator("#operations-pets-purgePetCache").click()
  await page.locator(".webhooks-container .opblock-post").first().click()
  await tryOutAllSchemas(page)
}

const runA11y = (page: Page) =>
  page
    .waitForFunction(() => "completeCount" in window)
    .then(() => expect(page.locator(".opblock").first()).toBeVisible())
    .then(() =>
      new AxeBuilder({ page })
        .options({ resultTypes: ["violations"] })
        .withRules(["color-contrast"])
        .analyze()
    )
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

const documents = [
  ["OAS 2.0", "/documents/bugs/10702/oas_2_0.yaml"],
  ["OAS 3.0", "/documents/bugs/10702/oas_3_0.yaml"],
  ["OAS 3.1", "/documents/bugs/10702/oas_3_1_1.yaml"],
  ["OAS 3.2", "/documents/bugs/10702/oas_3_2.yaml"],
] as const

for (const [name, path] of documents) {
  for (const colorScheme of ["light", "dark"] as const) {
    test.describe(`${name} (${colorScheme} mode)`, () => {
      test.use({ colorScheme })

      test("passes a11y checks", async ({ page }) => {
        await page.goto(`/?url=${path}`)
        await expect(page.locator("#swagger-ui")).toBeAttached()
        return runA11y(page)
      })

      test("authorization popup passes a11y checks", async ({ page }) => {
        await page.goto(`/?url=${path}`)
        await expect(page.locator("#swagger-ui")).toBeAttached()
        await page.locator("button.btn.authorize").click()
        await expect(page.locator(".dialog-ux")).toBeAttached()
        return runA11y(page)
      })

      test("passes a11y checks with all schemas open", async ({ page }) => {
        await page.goto(
          `/?url=${path}&docExpansion=full&defaultModelRendering=model&defaultModelExpandDepth=100`
        )
        await expect(page.locator("#swagger-ui")).toBeAttached()
        return runA11y(page)
      })

      test("passes a11y checks with all models expanded", async ({ page }) => {
        await page.goto(`/?url=${path}`)
        await expect(page.locator("#swagger-ui")).toBeAttached()
        await expandAllModels(page)
        return runA11y(page)
      })

      test("passes a11y checks when trying out each HTTP method available for all OAS versions", async ({
        page,
      }) => {
        await page.goto(`/?url=${path}`)
        await expect(page.locator("#swagger-ui")).toBeAttached()
        await page.locator(".opblock-get").first().click()
        await page.locator(".opblock-post").first().click()
        await page.locator(".opblock-put").first().click()
        await page.locator(".opblock-patch").first().click()
        await page.locator(".opblock-delete").first().click()
        await page.locator(".opblock-head").first().click()
        await page.locator(".opblock-deprecated").first().click()
        await page.locator(".opblock-options").first().click()
        await tryOutAllSchemas(page)
        return runA11y(page)
      })

      test("passes a11y checks when there are errors executing each HTTP method", async ({
        page,
      }) => {
        await page.goto(`/?url=${path}`)
        await expect(page.locator("#swagger-ui")).toBeAttached()
        await page.locator(".opblock-get").first().click()
        await page.locator(".opblock-post").first().click()
        await page.locator(".opblock-put").first().click()
        await page.locator(".opblock-patch").first().click()
        await page.locator(".opblock-delete").first().click()
        await page.locator(".opblock-head").first().click()
        await page.locator(".opblock-deprecated").first().click()
        await page.locator(".opblock-options").first().click()
        await tryOutAllSchemas(page)
        for (const button of await page.locator("button.execute").all()) {
          await button.click()
        }
        await expect(page.locator(".validation-errors").first()).toBeVisible()
        await waitForAnimations(page)
        return runA11y(page)
      })

      if (name === "OAS 3.2") {
        test("passes a11y checks when trying out HTTP methods available in OAS 3.2", async ({
          page,
        }) => {
          await tryOutOAS32Operations(page, path)
          return runA11y(page)
        })

        test("passes a11y checks when there are errors executing HTTP methods available in OAS 3.2", async ({
          page,
        }) => {
          await tryOutOAS32Operations(page, path)
          for (const button of await page.locator("button.execute").all()) {
            await button.click()
          }
          await expect(page.locator(".validation-errors").first()).toBeVisible()
          await waitForAnimations(page)
          return runA11y(page)
        })
      }
    })
  }
}
