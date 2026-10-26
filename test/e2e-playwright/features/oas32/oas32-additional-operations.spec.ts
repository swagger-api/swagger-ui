/**
 * @prettier
 */
import type { Page } from "@playwright/test"
import { test, expect } from "../../support/fixtures"

const isOpen = /(^|\s)is-open(\s|$)/

test.describe("OAS 3.2 Additional Operations", () => {
  const fixtureUrl = "/documents/features/oas32-additional-operations.yaml"
  const baseUrl = `/?url=${fixtureUrl}`
  const getOperation = "#operations-Items-getItems"
  const listOperation = "#operations-Items-listItems"
  const searchItemsOperation = "#operations-Items-searchItems"

  // Pets
  const copyOperation = "#operations-pets-copyPet"
  const searchOperation = "#operations-pets-searchPets"
  const pingOperation = (page: Page) =>
    page.locator(".opblock", {
      hasText: "Check health without an operationId",
    })

  const corsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, COPY, PING, Search-Pets",
    "access-control-allow-headers": "*",
  }

  const toggle = (page: Page, selector: string) =>
    page.locator(selector).locator(".opblock-summary-control").click()

  // Try it out is opt-in for custom methods: start Swagger UI again with the exact tokens.
  const loadWithConfig = async (
    page: Page,
    config: Record<string, unknown>
  ) => {
    await page.goto(baseUrl)
    await expect(page.locator(copyOperation)).toBeAttached()
    await page.evaluate(
      ({ url, extra }) => {
        const win = window as unknown as {
          ui: unknown
          SwaggerUIBundle: {
            (options: Record<string, unknown>): unknown
            presets: { apis: unknown }
          }
        }
        win.ui = win.SwaggerUIBundle({
          url,
          dom_id: "#swagger-ui",
          presets: [win.SwaggerUIBundle.presets.apis],
          ...extra,
        })
      },
      { url: fixtureUrl, extra: config }
    )
    await expect(page.locator(copyOperation)).toBeAttached()
  }

  test.describe("rendering", () => {
    test("renders standard and custom operations on the same path", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const get = page.locator(getOperation)
      await expect(get).toHaveClass(/opblock-get/)
      await expect(get.locator(".opblock-summary-method")).toHaveText("GET")
      await expect(get.locator(".opblock-summary-description")).toHaveText(
        "Get items with query parameters"
      )

      for (const [operation, method, summary] of [
        [listOperation, "LIST", "List items with a request body"],
        [
          searchItemsOperation,
          "X-Search",
          "Search with a mixed-case custom method",
        ],
      ]) {
        const locator = page.locator(operation)
        await expect(locator).toHaveClass(/opblock-custom/)
        await expect(locator.locator(".opblock-summary-method")).toHaveText(
          method
        )
        await expect(
          locator.locator(".opblock-summary-description")
        ).toHaveText(summary)
      }

      await expect(
        page
          .locator(".opblock-tag-section", {
            has: page.locator("#operations-tag-Items"),
          })
          .locator(".opblock")
      ).toHaveCount(3)

      await expect(page.locator("#operations-pets-getPet")).toHaveClass(
        /opblock-get/
      )
      await expect(page.locator(copyOperation)).toHaveClass(/opblock-custom/)
      await expect(page.locator(searchOperation)).toHaveClass(/opblock-custom/)
      const ping = pingOperation(page)
      await expect(ping).toHaveClass(/opblock-custom/)
      await expect(ping.locator(".opblock-summary-method")).toHaveText("PING")
    })

    test("preserves exact, case-sensitive custom method labels", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const method = (selector: string) =>
        page.locator(selector).locator(".opblock-summary-method")
      await expect(method(copyOperation)).toHaveText("COPY")
      await expect(method(searchOperation)).toHaveText("Search-Pets")
      await expect(method("#operations-pets-searchPetsLowercase")).toHaveText(
        "search-pets"
      )
      await expect(method("#operations-pets-getPet")).toHaveText("GET")
    })

    test("expands custom operation parameters, referenced request body, and responses", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await toggle(page, listOperation)
      const list = page.locator(listOperation)
      await expect(list).toHaveClass(isOpen)
      await expect(
        list.locator(".opblock-description-wrapper").first()
      ).toContainText("Filter items using the custom LIST method.")
      await expect(list.locator(".parameters-container")).toContainText(
        "status"
      )
      const body = list.locator(".opblock-section-request-body")
      await expect(body).toContainText("Required item filter")
      await expect(body).toContainText("category")
      const responses = list.locator(".responses-wrapper")
      for (const text of [
        "200",
        "Filtered items",
        "400",
        "Invalid item filter",
      ]) {
        await expect(responses).toContainText(text)
      }

      await toggle(page, getOperation)
      const get = page.locator(getOperation)
      await expect(get.locator(".parameters-container")).toContainText("limit")
      await expect(get.locator(".opblock-section-request-body")).toHaveCount(0)
    })

    test("renders referenced parameters and responses", async ({ page }) => {
      await page.goto(baseUrl)
      await toggle(page, copyOperation)
      const copy = page.locator(copyOperation)
      await expect(copy).toHaveClass(isOpen)
      await expect(copy.locator(".opblock-description")).toContainText(
        "Copy this pet"
      )
      await expect(copy.locator(".parameters")).toContainText("id")
      await expect(copy.locator(".parameters")).toContainText("destination")
      await expect(copy.locator(".responses-wrapper")).toContainText("201")
      await expect(copy.locator(".responses-wrapper")).toContainText(
        "Pet copied"
      )
      await expect(
        copy.locator(".responses-wrapper .highlight-code")
      ).toContainText("name")
    })

    test("renders referenced request bodies and operation-specific metadata", async ({
      page,
    }) => {
      await loadWithConfig(page, {
        displayOperationId: true,
        supportedSubmitMethods: ["Search-Pets"],
      })
      await toggle(page, searchOperation)
      const search = page.locator(searchOperation)
      await expect(search.locator(".opblock-summary-operation-id")).toHaveText(
        "searchPets"
      )
      await expect(
        search.locator(".opblock-section-request-body")
      ).toContainText("Milo")
      await expect(search.locator(".responses-wrapper")).toContainText(
        "Matching pets"
      )
      await expect(search.locator(".responses-wrapper")).toContainText("400")
      await expect(
        search.locator(".opblock-external-docs__link")
      ).toHaveAttribute("href", "https://example.com/search-docs")
      await expect(search.locator(".authorization__btn")).toBeAttached()
      await search.locator(".try-out__btn").click()
      await expect(search.locator(".operation-servers select")).toHaveValue(
        "https://example.com/search"
      )
    })

    test("ignores additionalOperations entries that duplicate fixed fields", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      const create = page.locator("#operations-invalid-createInvalid")
      await expect(create).toHaveClass(/opblock-post/)
      await expect(
        page.locator("#operations-invalid-duplicatePostUpper")
      ).toHaveCount(0)
      await expect(
        page.locator("#operations-invalid-duplicatePostLower")
      ).toHaveCount(0)
      await create.locator(".opblock-summary-control").click()
      const responses = page.locator(
        "#operations-invalid-createInvalid .responses-wrapper"
      )
      await expect(responses).toContainText("Created")
      await expect(responses).not.toContainText("Duplicate response")
    })
  })

  test.describe("deep linking", () => {
    test("opens a custom operation from its deep link after reload", async ({
      page,
    }) => {
      await page.goto(`${baseUrl}&deepLinking=true#/Items/listItems`)
      await expect(page.locator(listOperation)).toHaveClass(isOpen)
      await expect(page.locator(getOperation)).not.toHaveClass(isOpen)
      await page.reload()
      const list = page.locator(listOperation)
      await expect(list).toHaveClass(isOpen)
      await expect(list.locator(".opblock-section-request-body")).toContainText(
        "category"
      )
    })

    test("toggles a custom operation and keeps its hash", async ({ page }) => {
      await page.goto(`${baseUrl}&deepLinking=true#/pets/searchPets`)
      await expect(page.locator(searchOperation)).toHaveClass(isOpen)
      await expect(page.locator(copyOperation)).not.toHaveClass(isOpen)
      await toggle(page, searchOperation)
      await expect(page.locator(searchOperation)).not.toHaveClass(isOpen)
      await toggle(page, searchOperation)
      await expect
        .poll(() => page.evaluate(() => window.location.hash))
        .toBe("#/pets/searchPets")
    })
  })

  test.describe("state and validation", () => {
    test("validates required parameters through Try it out and keeps values scoped", async ({
      page,
    }) => {
      await loadWithConfig(page, { supportedSubmitMethods: ["get", "COPY"] })
      await toggle(page, copyOperation)
      const copy = page.locator(copyOperation)
      await copy.locator(".try-out__btn").click()
      await copy.locator(".execute").click()
      await expect(copy.locator('tr[data-param-name="id"] input')).toHaveClass(
        /invalid/
      )
      await expect(
        copy.locator('tr[data-param-name="destination"] input')
      ).toHaveClass(/invalid/)
      await expect(copy.locator(".curl-command")).toHaveCount(0)
      await copy.locator('tr[data-param-name="id"] input').fill("123")

      // The value typed for COPY must not leak into GET on the same path
      await toggle(page, "#operations-pets-getPet")
      const get = page.locator("#operations-pets-getPet")
      await get.locator(".try-out__btn").click()
      await expect(get.locator('tr[data-param-name="id"] input')).toHaveValue(
        ""
      )
    })

    test("validates the required custom-operation body before execution", async ({
      page,
    }) => {
      await loadWithConfig(page, {
        supportedSubmitMethods: ["get", "LIST", "X-Search"],
      })
      await toggle(page, listOperation)
      const list = page.locator(listOperation)
      await list.locator(".try-out__btn").click()
      await list.locator(".body-param textarea").clear()
      await list.locator(".execute").click()
      await expect(list.locator(".body-param textarea")).toHaveClass(/invalid/)
      await expect(list.locator(".curl-command")).toHaveCount(0)
    })

    test("respects the default submission allowlist for custom methods", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await toggle(page, copyOperation)
      await expect(page.locator(copyOperation)).toHaveClass(isOpen)
      await expect(
        page.locator(copyOperation).locator(".try-out__btn")
      ).toHaveCount(0)
    })
  })

  test.describe("callbacks and webhooks", () => {
    test("renders additional operations in callback and webhook Path Items", async ({
      page,
    }) => {
      await page.goto(baseUrl)
      await toggle(page, copyOperation)
      await page
        .locator(copyOperation)
        .locator(".tab-item", { hasText: "Callbacks" })
        .click()
      const notifyCopy = page.locator("#operations-callbacks-notifyCopy")
      await expect(notifyCopy).toHaveClass(/opblock-custom/)
      await expect(notifyCopy.locator(".opblock-summary-method")).toHaveText(
        "Notify-Pet"
      )

      await expect(page.locator(".webhooks .opblock")).toHaveCount(2)
      const webhook = page.locator("#operations-webhooks-notifyPetChanged")
      await expect(webhook).toHaveClass(/opblock-custom/)
      await expect(webhook.locator(".opblock-summary-method")).toHaveText(
        "Notify-Pet"
      )
      await expect(
        page.locator("#operations-webhooks-additionalOperationspetChanged")
      ).toHaveCount(0)
    })

    test("displays standard OAS 3.2 webhooks", async ({ page }) => {
      await page.goto(baseUrl)
      const created = page.locator("#operations-webhooks-petCreated")
      await expect(created).toHaveClass(/opblock-post/)
      await expect(created.locator(".opblock-summary-method")).toHaveText(
        "POST"
      )
      await created.locator(".opblock-summary-control").click()
      await expect(created).toContainText("A pet was created")
      await expect(created).toContainText("Received")
    })
  })

  test.describe("execution", () => {
    for (const [operation, method, url, body] of [
      [listOperation, "LIST", "/api/items", { category: "books" }],
      [
        searchItemsOperation,
        "X-Search",
        "/search-api/items",
        { term: "notebook" },
      ],
    ] as const) {
      test(`executes ${method} with the released Swagger Client`, async ({
        page,
      }) => {
        const requests: { url: string; method: string; body: string | null }[] =
          []
        let contentType: string | undefined
        await page.route(
          (u) => u.pathname === url,
          async (route) => {
            const request = route.request()
            requests.push({
              url: request.url(),
              method: request.method(),
              body: request.postData(),
            })
            contentType = (await request.allHeaders())["content-type"]
            await route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify(["matched"]),
            })
          }
        )
        await loadWithConfig(page, {
          supportedSubmitMethods: ["get", "LIST", "X-Search"],
        })

        await toggle(page, operation)
        const opblock = page.locator(operation)
        await opblock.locator(".try-out__btn").click()
        await expect
          .poll(async () =>
            JSON.parse(
              await opblock.locator(".body-param textarea").inputValue()
            )
          )
          .toEqual(body)
        await opblock.locator(".execute").click()

        await expect(opblock.locator(".live-responses-table")).toContainText(
          "matched"
        )
        expect(requests).toHaveLength(1)
        expect(new URL(requests[0].url).pathname).toBe(url)
        expect(requests[0].method).toBe(method)
        expect(JSON.parse(requests[0].body as string)).toEqual(body)
        expect(contentType).toBe("application/json")
        await expect(opblock.locator(".live-responses-table")).toContainText(
          "200"
        )
      })
    }

    test("executes COPY with its exact token and headers", async ({ page }) => {
      let copyRequest: { method: string; destination?: string } | undefined
      await page.route("**/pets/123", async (route) => {
        const request = route.request()
        if (request.method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: corsHeaders })
        } else if (request.method() === "COPY") {
          copyRequest = {
            method: request.method(),
            destination: (await request.allHeaders()).destination,
          }
          await route.fulfill({
            status: 201,
            headers: corsHeaders,
            contentType: "application/json",
            body: JSON.stringify({ name: "Milo" }),
          })
        } else {
          await route.fallback()
        }
      })

      await loadWithConfig(page, { supportedSubmitMethods: ["COPY"] })
      await toggle(page, copyOperation)
      const copy = page.locator(copyOperation)
      await copy.locator(".try-out__btn").click()
      await copy.locator('tr[data-param-name="id"] input').fill("123")
      await copy
        .locator('tr[data-param-name="destination"] input')
        .fill("/pets/456")
      await copy.locator(".execute").click()

      await expect(copy.locator(".live-responses-table")).toContainText("201")
      expect(copyRequest).toEqual({ method: "COPY", destination: "/pets/456" })
    })

    // Pending upstream: swagger-client 3.38.2 cannot resolve additionalOperations
    // without an operationId by pathName + method ("Operation undefined not found").
    // Re-enable once supported in swagger-js.
    test.skip("executes a custom operation that has no operationId", async ({
      page,
    }) => {
      let pingMethod: string | undefined
      await page.route("**/health", async (route) => {
        const request = route.request()
        if (request.method() === "OPTIONS") {
          await route.fulfill({ status: 204, headers: corsHeaders })
        } else if (request.method() === "PING") {
          pingMethod = request.method()
          await route.fulfill({ status: 200, headers: corsHeaders })
        } else {
          await route.fallback()
        }
      })

      await loadWithConfig(page, { supportedSubmitMethods: ["PING"] })
      const ping = pingOperation(page)
      await ping.locator(".opblock-summary-control").click()
      await ping.locator(".try-out__btn").click()
      await ping.locator(".execute").click()
      await expect.poll(() => pingMethod).toBe("PING")
    })
  })
})
