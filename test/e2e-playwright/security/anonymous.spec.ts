/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#6767: Operation should be considered anonymous if its security only includes empty object (this was decided by implementation choice and may change or be extended in the future)", () => {
  test("Should consider method anonymous if security contains only empty object", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/security/anonymous.yaml")
    // guard against a vacuous pass: the operation must have rendered
    await expect(
      page.locator("#operations-default-get_onlyEmpty")
    ).toBeAttached()
    await expect(
      page.locator("#operations-default-get_onlyEmpty .authorization__btn")
    ).toHaveCount(0)
  })

  test("Should consider method as secured if security contains no empty object", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/security/anonymous.yaml")
    await expect(
      page.locator("#operations-default-get_required .authorization__btn")
    ).toBeAttached()
  })

  test("Should consider method as secured if security contains empty object but has at least one more security defined", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/security/anonymous.yaml")
    await expect(
      page.locator("#operations-default-get_withBoth .authorization__btn")
    ).toBeAttached()
  })
})
