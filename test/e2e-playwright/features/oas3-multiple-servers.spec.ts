/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

const serverSelect = ".scheme-container .schemes .servers label > select"
const executeButton = ".execute.opblock-control__btn"

test.describe("OpenAPI 3.0 Multiple Servers", () => {
  test("should render and execute for server '/test-url-1'", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-multiple-servers.yaml")
    await page.locator(serverSelect).selectOption("/test-url-1")
    await swaggerUi.toggleOperation("#operations-default-get_")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // Execute
    await page.locator(executeButton).click()
    await expect(page.locator(".responses-wrapper .request-url")).toContainText(
      "/test-url-1"
    )
  })
  test("should render and execute for server '/test-url-2'", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-multiple-servers.yaml")
    await page.locator(serverSelect).selectOption("/test-url-2")
    await swaggerUi.toggleOperation("#operations-default-get_")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // Execute
    await page.locator(executeButton).click()
    await expect(page.locator(".responses-wrapper .request-url")).toContainText(
      "/test-url-2"
    )
  })
  test("should render and execute for server '/test-url-1' after sequence: select '/test-url-2' -> Try-It-Out -> select '/test-url-1'", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-multiple-servers.yaml")
    await page.locator(serverSelect).selectOption("/test-url-2")
    await swaggerUi.toggleOperation("#operations-default-get_")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // Select a different server
    await page.locator(serverSelect).selectOption("/test-url-1")
    // Execute
    await page.locator(executeButton).click()
    await expect(page.locator(".responses-wrapper .request-url")).toContainText(
      "/test-url-1"
    )
  })
  test("should render and execute for server '/test-url-switch-1' after changing api definition", async ({
    page,
    swaggerUi,
  }) => {
    await page.goto("/?url=/documents/features/oas3-multiple-servers.yaml")
    await page.locator(serverSelect).selectOption("/test-url-2")
    await page.goto(
      "/?url=/documents/features/oas3-multiple-servers-switch.yaml"
    )
    await page.locator(serverSelect).selectOption("/test-url-switch-2")
    await swaggerUi.toggleOperation("#operations-default-get_")
    // Expand Try It Out
    await swaggerUi.tryItOut()
    // Execute
    await page.locator(executeButton).click()
    await expect(page.locator(".responses-wrapper .request-url")).toContainText(
      "/test-url-switch-2"
    )
  })
})
