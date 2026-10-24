/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

interface DeeplinkTestOptions {
  baseUrl: string
  elementToGet: string
  correctElementId: string
  correctFragment: string
  correctHref: string
}

test.describe("Deep linking feature", () => {
  test.describe("in Swagger 2", () => {
    const swagger2BaseUrl =
      "/?deepLinking=true&url=/documents/features/deep-linking.swagger.yaml"

    test.describe("regular Operation", () => {
      operationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-get",
        correctElementId: "operations-myTag-myOperation",
        correctFragment: "#/myTag/myOperation",
        correctHref: "#/myTag/myOperation",
      })
    })

    test.describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctFragment = "#/my%20Tag/my%20Operation"

      operationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet,
        correctElementId: "operations-my_Tag-my_Operation",
        correctFragment,
        correctHref: "#/my%20Tag/my%20Operation",
      })

      const legacyFragment = "#/my_Tag/my_Operation"

      test("should expand the operation when reloaded and provided the legacy fragment", async ({
        page,
      }) => {
        await page.goto(`${swagger2BaseUrl}${legacyFragment}`)
        await page.reload()
        await expect(page.locator(`${elementToGet}.is-open`)).toBeAttached()
      })

      test.skip("should rewrite to the correct fragment when provided the legacy fragment", async ({
        page,
      }) => {
        await page.goto(`${swagger2BaseUrl}${legacyFragment}`)
        await page.reload()
        await expect(page).toHaveURL(
          (url) => new URL(url).hash === correctFragment
        )
      })
    })

    test.describe("Operation with underscores in tag+id", () => {
      operationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation",
      })
    })

    test.describe("Operation with UTF-16 characters", () => {
      operationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment:
          "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел",
      })
    })

    test.describe("Operation with no operationId", () => {
      operationDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId",
      })
    })

    test.describe("regular Tag", () => {
      tagDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: `.opblock-tag[data-tag="myTag"][data-is-open="true"]`,
        correctElementId: "operations-tag-myTag",
        correctFragment: "#/myTag",
        correctHref: "#/myTag",
      })
    })

    test.describe("Tag with whitespace", () => {
      tagDeeplinkTestFactory({
        baseUrl: swagger2BaseUrl,
        elementToGet: `.opblock-tag[data-tag="my Tag"][data-is-open="true"]`,
        correctElementId: "operations-tag-my_Tag",
        correctFragment: "#/my%20Tag",
        correctHref: "#/my%20Tag",
      })
    })
  })

  test.describe("in OpenAPI 3", () => {
    const openAPI3BaseUrl =
      "/?deepLinking=true&url=/documents/features/deep-linking.openapi.yaml"

    test.describe("regular Operation", () => {
      operationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-get",
        correctElementId: "operations-myTag-myOperation",
        correctFragment: "#/myTag/myOperation",
        correctHref: "#/myTag/myOperation",
      })
    })

    test.describe("Operation with whitespace in tag+id", () => {
      const elementToGet = ".opblock-post"
      const correctFragment = "#/my%20Tag/my%20Operation"

      operationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-post",
        correctElementId: "operations-my_Tag-my_Operation",
        correctFragment,
        correctHref: "#/my%20Tag/my%20Operation",
      })

      const legacyFragment = "#/my_Tag/my_Operation"

      test("should expand the operation when reloaded and provided the legacy fragment", async ({
        page,
      }) => {
        await page.goto(`${openAPI3BaseUrl}${legacyFragment}`)
        await page.reload()
        await expect(page.locator(`${elementToGet}.is-open`)).toBeAttached()
      })

      test.skip("should rewrite to the correct fragment when provided the legacy fragment", async ({
        page,
      }) => {
        await page.goto(`${openAPI3BaseUrl}${legacyFragment}`)
        await page.reload()
        await expect(page).toHaveURL(
          (url) => new URL(url).hash === correctFragment
        )
      })
    })

    test.describe("Operation with underscores in tag+id", () => {
      operationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-patch",
        correctElementId: "operations-underscore_Tag-underscore_Operation",
        correctFragment: "#/underscore_Tag/underscore_Operation",
        correctHref: "#/underscore_Tag/underscore_Operation",
      })
    })

    test.describe("Operation with UTF-16 characters", () => {
      operationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-head",
        correctElementId: "operations-шеллы-пошел",
        correctFragment:
          "#/%D1%88%D0%B5%D0%BB%D0%BB%D1%8B/%D0%BF%D0%BE%D1%88%D0%B5%D0%BB",
        correctHref: "#/шеллы/пошел",
      })
    })

    test.describe("Operation with no operationId", () => {
      operationDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: ".opblock-put",
        correctElementId: "operations-tagTwo-put_noOperationId",
        correctFragment: "#/tagTwo/put_noOperationId",
        correctHref: "#/tagTwo/put_noOperationId",
      })
    })

    test.describe("regular Tag", () => {
      tagDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: `.opblock-tag[data-tag="myTag"][data-is-open="true"]`,
        correctElementId: "operations-tag-myTag",
        correctFragment: "#/myTag",
        correctHref: "#/myTag",
      })
    })

    test.describe("Tag with whitespace", () => {
      tagDeeplinkTestFactory({
        baseUrl: openAPI3BaseUrl,
        elementToGet: `.opblock-tag[data-tag="my Tag"][data-is-open="true"]`,
        correctElementId: "operations-tag-my_Tag",
        correctFragment: "#/my%20Tag",
        correctHref: "#/my%20Tag",
      })
    })
  })
})

function operationDeeplinkTestFactory({
  baseUrl,
  elementToGet,
  correctElementId,
  correctFragment,
  correctHref,
}: DeeplinkTestOptions) {
  test("should generate a correct element ID", async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page.locator(elementToGet)).toHaveId(correctElementId)
  })

  test("should add the correct element fragment to the URL when expanded", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await page.locator(elementToGet).click()
    await expect(page).toHaveURL((url) => new URL(url).hash === correctFragment)
  })

  test("should provide an anchor link that has the correct fragment as href", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    const anchor = page.locator(elementToGet).locator("a")
    await expect(anchor).toHaveAttribute("href", correctHref)
    await anchor.click()
    await expect(page).toHaveURL((url) => new URL(url).hash === correctFragment)
  })

  test("should expand the operation when reloaded", async ({ page }) => {
    await page.goto(`${baseUrl}${correctFragment}`)
    await expect(page.locator(`${elementToGet}.is-open`)).toBeAttached()
  })

  test("should retain the correct fragment when reloaded", async ({ page }) => {
    await page.goto(`${baseUrl}${correctFragment}`)
    await page.reload()
    await expect(page).toHaveURL((url) => new URL(url).hash === correctFragment)
  })

  test("should expand a tag with docExpansion disabled", async ({ page }) => {
    await page.goto(`${baseUrl}&docExpansion=none${correctFragment}`)
    await expect(page.locator(`.opblock-tag-section.is-open`)).toHaveCount(1)
  })

  test("should expand an operation with docExpansion disabled", async ({
    page,
  }) => {
    await page.goto(`${baseUrl}&docExpansion=none${correctFragment}`)
    await expect(page.locator(`.opblock.is-open`)).toHaveCount(1)
  })
}

function tagDeeplinkTestFactory({
  baseUrl,
  elementToGet,
  correctElementId,
  correctFragment,
  correctHref,
}: DeeplinkTestOptions) {
  test("should generate a correct element ID", async ({ page }) => {
    await page.goto(baseUrl)
    await expect(page.locator(elementToGet)).toHaveId(correctElementId)
  })

  test("should add the correct element fragment to the URL when expanded", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await page.locator(elementToGet).click()
    // tags need two clicks because they're expanded by default. `elementToGet`
    // stops matching once the tag collapses (data-is-open="false"), so the
    // second click re-targets the same element by id instead (Cypress kept
    // the original subject).
    await page.locator(`[id="${correctElementId}"]`).click()
    await expect(page).toHaveURL((url) => new URL(url).hash === correctFragment)
  })

  test("should provide an anchor link that has the correct fragment as href", async ({
    page,
  }) => {
    await page.goto(baseUrl)
    await expect(page.locator(elementToGet).locator("a")).toHaveAttribute(
      "href",
      correctHref
    )
  })

  test("should expand the tag when reloaded", async ({ page }) => {
    await page.goto(`${baseUrl}${correctFragment}`)
    await expect(
      page.locator(`${elementToGet}[data-is-open="true"]`)
    ).toBeAttached()
  })

  test("should retain the correct fragment when reloaded", async ({ page }) => {
    await page.goto(`${baseUrl}${correctFragment}`)
    await page.reload()
    await expect(page).toHaveURL((url) => new URL(url).hash === correctFragment)
  })

  test("should expand a tag with docExpansion disabled", async ({ page }) => {
    await page.goto(`${baseUrl}&docExpansion=none${correctFragment}`)
    await expect(page.locator(`.opblock-tag-section.is-open`)).toHaveCount(1)
  })
}
