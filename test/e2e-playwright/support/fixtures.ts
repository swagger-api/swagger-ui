/**
 * @prettier
 */
import { test as base, expect } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

// Thin wrappers over selectors that 3+ specs repeat. Everything else stays
// as plain `page.locator(...)` in the specs so DOM selectors remain visible.
export class SwaggerUi {
  readonly page: Page
  readonly tryItOutButton: Locator
  readonly executeButton: Locator

  constructor(page: Page) {
    this.page = page
    this.tryItOutButton = page.locator(".try-out__btn")
    this.executeButton = page.locator(".execute")
  }

  // expands (or collapses) an operation, e.g. "#operations-default-get_foo"
  async toggleOperation(selector: string): Promise<void> {
    await this.page.locator(selector).click()
  }

  async tryItOut(): Promise<void> {
    await this.tryItOutButton.click()
  }

  async execute(): Promise<void> {
    await this.executeButton.click()
  }
}

/**
 * The query parameter (and config option) that switches the Schemas section
 * and the Schema tab to the unified JSON Schema view.
 */
export const UNIFIED_JSON_SCHEMA_PARAM = "unifiedJSONSchemaEnabled"

type Scope = Page | Locator

/**
 * Schema-view locators shared by the specs that also run in the
 * `unified-json-schema` project. Each entry is the classic json-schema-2020-12
 * selector (unchanged, used by the default project) or its unified-view
 * equivalent, which selects only through the view's automation hooks
 * (`data-json-schema-unified*`, `data-keyword`, `data-expanded`, ...), roles
 * and text. A scope argument defaults to the page.
 */
export interface SchemaLocators {
  /** Every schema root: `.json-schema-2020-12`. */
  schema(scope?: Scope): Locator
  /** Schemas that are not nested in another schema. */
  topLevelSchema(scope?: Scope): Locator
  /** The nearest schema root around `element`. */
  closestSchema(element: Locator): Locator
  /** Schema titles: `.json-schema-2020-12__title`. */
  title(scope?: Scope): Locator
  /** The type attribute of a schema head: `.json-schema-2020-12__attribute`. */
  attribute(scope?: Scope): Locator
  /** The entries of properties lists and viewers: `.json-schema-2020-12-property`. */
  property(scope?: Scope): Locator
  /** Expansion toggles of schemas and keywords: `.json-schema-2020-12-accordion`. */
  accordion(scope?: Scope): Locator
  /** The icons of collapsed toggles (the collapsed toggles in the unified view). */
  collapsedAccordion(scope?: Scope): Locator
  /** "Expand all" / "Collapse all": `.json-schema-2020-12-expand-deep-button`. */
  expandDeepButton(scope?: Scope): Locator
  /** A keyword block by its unified `data-keyword` name, e.g. "extensionKeywords". */
  keyword(name: string, scope?: Scope): Locator
  /** A keyword name containing `text`: `.json-schema-2020-12-keyword__name`. */
  keywordName(text: string, scope?: Scope): Locator
  /** A secondary keyword name: `.json-schema-2020-12-keyword__name--secondary`. */
  secondaryKeywordName(text: string, scope?: Scope): Locator
  /** A JSON viewer name: `.json-schema-2020-12-json-viewer__name`. */
  jsonViewerName(text: string, scope?: Scope): Locator
  /** The value shown next to a JSON viewer entry, given the entry's element. */
  jsonViewerValue(entry: Locator): Locator
  /** The children lists of expanded JSON viewers. */
  jsonViewerChildren(scope?: Scope): Locator
  /** The extension keyword viewers: `.json-schema-2020-12-json-viewer-extension-keyword`. */
  extensionKeywordViewer(scope?: Scope): Locator
  /** The Schemas section's expand/collapse control: `.models h4 .models-control`. */
  modelsControl(scope?: Scope): Locator
  /** The scroll container of a virtualized Schemas section: `.models-scroll`. */
  modelsScroll(scope?: Scope): Locator
  /** Asserts the Schemas section is open (`.models.is-open`) or closed. */
  expectModelsOpen(open: boolean): Promise<void>
  /** Asserts a schema's body is expanded (not `.json-schema-2020-12-body--collapsed`) or collapsed. */
  expectSchemaExpanded(schema: Locator, expanded: boolean): Promise<void>
}

const classicKeywordClass = (name: string): string =>
  name === "extensionKeywords" ? "extension-keywords" : name

const isOpen = /(^|\s)is-open(\s|$)/
const collapsedBody = /(^|\s)json-schema-2020-12-body--collapsed(\s|$)/

const classicSchemaLocators = (page: Page): SchemaLocators => ({
  schema: (scope = page) => scope.locator(".json-schema-2020-12"),
  topLevelSchema: (scope = page) =>
    scope.locator(".json-schema-2020-12:not(.json-schema-2020-12--embedded)"),
  closestSchema: (element) =>
    element.locator(
      "xpath=ancestor::*[contains(concat(' ', normalize-space(@class), ' '), ' json-schema-2020-12 ')][1]"
    ),
  title: (scope = page) => scope.locator(".json-schema-2020-12__title"),
  attribute: (scope = page) => scope.locator(".json-schema-2020-12__attribute"),
  property: (scope = page) => scope.locator(".json-schema-2020-12-property"),
  accordion: (scope = page) => scope.locator(".json-schema-2020-12-accordion"),
  collapsedAccordion: (scope = page) =>
    scope.locator(
      ".json-schema-2020-12-accordion .json-schema-2020-12-accordion__icon--collapsed"
    ),
  expandDeepButton: (scope = page) =>
    scope.locator(".json-schema-2020-12-expand-deep-button"),
  keyword: (name, scope = page) =>
    scope.locator(`.json-schema-2020-12-keyword--${classicKeywordClass(name)}`),
  keywordName: (text, scope = page) =>
    scope
      .locator(".json-schema-2020-12-keyword__name")
      .filter({ hasText: text }),
  secondaryKeywordName: (text, scope = page) =>
    scope
      .locator(".json-schema-2020-12-keyword__name--secondary")
      .filter({ hasText: text }),
  jsonViewerName: (text, scope = page) =>
    scope
      .locator(".json-schema-2020-12-json-viewer__name")
      .filter({ hasText: text }),
  jsonViewerValue: (entry) =>
    entry
      .locator("xpath=..")
      .locator(":scope > .json-schema-2020-12-json-viewer__value"),
  jsonViewerChildren: (scope = page) =>
    scope.locator(".json-schema-2020-12-json-viewer__children"),
  extensionKeywordViewer: (scope = page) =>
    scope.locator(".json-schema-2020-12-json-viewer-extension-keyword"),
  modelsControl: (scope = page) => scope.locator(".models h4 .models-control"),
  modelsScroll: (scope = page) => scope.locator(".models-scroll"),
  expectModelsOpen: async (open) => {
    if (open) await expect(page.locator(".models")).toHaveClass(isOpen)
    else await expect(page.locator(".models")).not.toHaveClass(isOpen)
  },
  expectSchemaExpanded: async (schema, expanded) => {
    const body = schema.locator(".json-schema-2020-12-body").first()
    if (expanded) await expect(body).not.toHaveClass(collapsedBody)
    else await expect(body).toHaveClass(collapsedBody)
  },
})

const UNIFIED_SCHEMA = "[data-json-schema-unified]"
const UNIFIED_MODELS = "[data-json-schema-unified-models]"
const UNIFIED_JSON_VIEWER = "[data-json-viewer-tone]"

const unifiedSchemaLocators = (page: Page): SchemaLocators => {
  // Locator scopes match inside the scope only, so a page-wide lookup is
  // scoped to the schemas and a given scope is used as it is.
  const inSchemas = (scope: Scope): Scope =>
    scope === page ? page.locator(UNIFIED_SCHEMA) : scope
  const schemaText = (text: string, scope: Scope) =>
    inSchemas(scope).getByText(text, { exact: true })

  return {
    schema: (scope = page) => scope.locator(UNIFIED_SCHEMA),
    topLevelSchema: (scope = page) =>
      scope.locator(`${UNIFIED_SCHEMA}[data-json-schema-level="0"]`),
    closestSchema: (element) =>
      element.locator("xpath=ancestor::*[@data-json-schema-unified][1]"),
    title: (scope = page) => scope.locator("[data-json-schema-title]"),
    attribute: (scope = page) => scope.locator('[data-keyword="type"]'),
    property: (scope = page) => inSchemas(scope).locator("li"),
    accordion: (scope = page) => scope.locator("button[data-expanded]"),
    collapsedAccordion: (scope = page) =>
      scope.locator('button[data-expanded="false"]'),
    expandDeepButton: (scope = page) =>
      inSchemas(scope).getByRole("button", {
        name: /^(Expand|Collapse) all$/,
        includeHidden: true,
      }),
    keyword: (name, scope = page) => scope.locator(`[data-keyword="${name}"]`),
    keywordName: (text, scope = page) => schemaText(text, scope),
    secondaryKeywordName: (text, scope = page) => schemaText(text, scope),
    jsonViewerName: (text, scope = page) => schemaText(text, scope),
    jsonViewerValue: (entry) =>
      entry.locator("xpath=..").locator(":scope > [data-json-viewer-value]"),
    jsonViewerChildren: (scope = page) =>
      scope.locator(
        `:is(${UNIFIED_JSON_VIEWER})[data-expanded="true"] > [data-json-viewer-children]`
      ),
    extensionKeywordViewer: (scope = page) =>
      scope.locator(
        '[data-keyword="extensionKeywords"] [data-json-viewer-tone="extension"]'
      ),
    modelsControl: (scope = page) =>
      scope.locator(UNIFIED_MODELS).getByRole("button", { name: /^Schemas$/ }),
    modelsScroll: (scope = page) =>
      scope.locator(
        `${UNIFIED_MODELS} [data-json-schema-unified-models-scroll]`
      ),
    expectModelsOpen: async (open) => {
      await expect(page.locator(UNIFIED_MODELS)).toHaveAttribute(
        "data-expanded",
        open ? "true" : "false"
      )
    },
    expectSchemaExpanded: async (schema, expanded) => {
      await expect(schema).toHaveAttribute(
        "data-expanded",
        expanded ? "true" : "false"
      )
    },
  }
}

export const schemaLocators = (page: Page, unified: boolean): SchemaLocators =>
  unified ? unifiedSchemaLocators(page) : classicSchemaLocators(page)

interface UnifiedViewState {
  hasSwaggerUi: boolean
  optionValue: unknown
  hasUnifiedDialect: boolean
  unifiedElements: number
  classicSchemaElements: number
}

// The classic schema view the option replaces for 3.1/3.2 documents:
// json-schema-2020-12. The Schema tab's `.model-box` frame, the Example Value
// tab and the parameter inputs are not switched, so they are not listed.
const CLASSIC_SCHEMA_SELECTOR = ".json-schema-2020-12"

// Runs in the page: what the guard of the unified project checks.
const readUnifiedViewState = (
  classicSchemaSelector: string
): UnifiedViewState => {
  interface SwaggerUiSystem {
    getConfigs?: () => Record<string, unknown>
    specSelectors?: Record<string, (() => boolean) | undefined>
  }
  const ui = (window as unknown as { ui?: SwaggerUiSystem }).ui
  const specSelectors = ui?.specSelectors

  return {
    hasSwaggerUi: typeof ui?.getConfigs === "function",
    optionValue: ui?.getConfigs?.().unifiedJSONSchemaEnabled,
    hasUnifiedDialect: ["isOAS32", "isOAS31"].some(
      (selector) => specSelectors?.[selector]?.() === true
    ),
    unifiedElements: document.querySelectorAll(
      "[data-json-schema-unified-models], [data-json-schema-unified-model], [data-json-schema-unified]"
    ).length,
    classicSchemaElements: document.querySelectorAll(classicSchemaSelector)
      .length,
  }
}

// Runs in the page before any of its scripts: adds the option to the query
// string of the top-level document (keeping the other parameters and the
// hash as they are), so Swagger UI's query config picks it up.
const addUnifiedOptionToUrl = ({
  origin,
  param,
}: {
  origin: string | null
  param: string
}) => {
  if (window !== window.top) return
  if (origin !== null && window.location.origin !== origin) return
  const url = new URL(window.location.href)
  if (url.searchParams.has(param)) return
  url.search = url.search ? `${url.search}&${param}=true` : `?${param}=true`
  window.history.replaceState(window.history.state, "", url.href)
}

export interface SwaggerUiOptions {
  /**
   * Run the test with `unifiedJSONSchemaEnabled=true` on every page of the
   * app, and fail it unless the option really applied (see the `page`
   * fixture).
   */
  unifiedJSONSchema: boolean
}

export interface SwaggerUiFixtures {
  swaggerUi: SwaggerUi
  /** `schemaLocators(page, unifiedJSONSchema)`. */
  schemaUi: SchemaLocators
}

export const test = base.extend<SwaggerUiFixtures & SwaggerUiOptions>({
  unifiedJSONSchema: [false, { option: true }],
  // Cypress's `uncaught:exception` handler returned `true`, and only a `false`
  // return suppresses the failure, so uncaught app exceptions failed the old
  // tests. Same here: collect them and fail the test during fixture teardown.
  context: async ({ context, unifiedJSONSchema, baseURL }, use) => {
    const errors: string[] = []
    context.on("weberror", (webError) => {
      const error = webError.error()
      console.error(`[pageerror] ${webError.page()?.url() ?? ""}`, error)
      errors.push(error.stack ?? error.message)
    })
    if (unifiedJSONSchema) {
      await context.addInitScript(addUnifiedOptionToUrl, {
        origin: baseURL ? new URL(baseURL).origin : null,
        param: UNIFIED_JSON_SCHEMA_PARAM,
      })
    }
    await use(context)
    expect(errors, "uncaught page exceptions").toEqual([])
  },
  // Guard of the unified project against false passes: a test that passed
  // must have ended on a Swagger UI page where the option applied, the
  // document's version (3.1 or 3.2) has a unified dialect, the unified view
  // rendered and no classic json-schema-2020-12 view did. Pages without
  // `window.ui`, or whose index ignores the query string, fail here.
  page: async ({ page, unifiedJSONSchema }, use, testInfo) => {
    await use(page)
    if (!unifiedJSONSchema || testInfo.status !== "passed") return
    const state = await page.evaluate(
      readUnifiedViewState,
      CLASSIC_SCHEMA_SELECTOR
    )
    const where = `on ${page.url()}`
    expect(state.hasSwaggerUi, `window.ui exposed ${where}`).toBe(true)
    expect(state.optionValue, `unifiedJSONSchemaEnabled ${where}`).toBe(true)
    expect(
      state.hasUnifiedDialect,
      `document version has a unified dialect ${where}`
    ).toBe(true)
    expect(
      state.unifiedElements,
      `unified view elements ${where}`
    ).toBeGreaterThan(0)
    expect(
      state.classicSchemaElements,
      `classic schema view elements (${CLASSIC_SCHEMA_SELECTOR}) ${where}`
    ).toBe(0)
  },
  swaggerUi: async ({ page }, use) => {
    await use(new SwaggerUi(page))
  },
  schemaUi: async ({ page, unifiedJSONSchema }, use) => {
    await use(schemaLocators(page, unifiedJSONSchema))
  },
})

export { expect }
