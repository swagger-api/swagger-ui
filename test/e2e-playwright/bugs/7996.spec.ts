/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("#7996: tag description text fills container when externalDocs section absent", () => {
  test("should show externalDocs div when externalDocs present in specification", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/7996-tags-externalDocs.yaml")
    await expect(
      page.locator("#operations-tag-foo .info__externaldocs")
    ).toBeAttached()
  })
  test("should have no externalDocs div when externalDocs absent from specification", async ({
    page,
  }) => {
    await page.goto("/?url=/documents/bugs/7996-tags-externalDocs.yaml")
    await expect(
      page.locator("#operations-tag-bar .info__externaldocs")
    ).toHaveCount(0)
  })
})
