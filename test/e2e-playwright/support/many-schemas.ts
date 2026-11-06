/**
 * @prettier
 */
import type { Page } from "@playwright/test"

/** Served by `routeManySchemasDocument`; nothing exists at this path on disk. */
export const MANY_SCHEMAS_URL =
  "/documents/generated/many-schemas.openapi31.json"

const schemaName = (index: number): string =>
  `PerfModel${String(index).padStart(4, "0")}`

/** An OpenAPI 3.1 document with `count` uniform component schemas. */
export const manySchemasDocument = (count: number) => ({
  openapi: "3.1.0",
  info: {
    title: "Many Schemas (unified JSON Schema perf fixture)",
    version: "1.0.0",
  },
  paths: {
    "/ping": {
      get: {
        operationId: "ping",
        responses: { "200": { description: "pong" } },
      },
    },
  },
  components: {
    schemas: Object.fromEntries(
      Array.from({ length: count }, (_, i) => [
        schemaName(i + 1),
        {
          type: "object",
          description: `Generated perf schema ${i + 1}`,
          required: ["id"],
          properties: {
            id: { type: "integer", format: "int64" },
            name: { type: "string", maxLength: 64 },
            createdAt: { type: "string", format: "date-time" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      ])
    ),
  },
})

/** Answers requests for `MANY_SCHEMAS_URL` with a generated document. */
export const routeManySchemasDocument = async (
  page: Page,
  count: number
): Promise<void> => {
  const body = JSON.stringify(manySchemasDocument(count))
  await page.route(`**${MANY_SCHEMAS_URL}`, (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body })
  )
}
