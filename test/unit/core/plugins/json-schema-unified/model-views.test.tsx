/**
 * @prettier
 */
import React from "react"
import { mount } from "enzyme"
import { Provider } from "react-redux"
import { fromJS, List } from "immutable"
import noop from "lodash/noop"

import System from "core/system"
import UtilPlugin from "core/plugins/util"
import LogsPlugin from "core/plugins/logs"
import ViewPlugin from "core/plugins/view"
import SpecPlugin from "core/plugins/spec"
import IconsPlugin from "core/plugins/icons"
import LayoutPlugin from "core/plugins/layout"
import DeepLinkingPlugin from "core/plugins/deep-linking"
import JSONSchema5Plugin from "core/plugins/json-schema-5"
import SafeRenderPlugin from "core/plugins/safe-render"
import Markdown from "core/components/providers/markdown"
import { Collapse } from "core/components/layout-utils"
import OpenAPI30Plugin from "core/plugins/oas3"
import OpenAPI31Plugin from "core/plugins/oas31"
import OpenAPI32Plugin from "core/plugins/oas32"
import JSONSchema202012Plugin from "core/plugins/json-schema-2020-12"
import JSONSchemaUnifiedPlugin from "core/plugins/json-schema-unified"
import {
  UNIFIED_DIALECTS,
  getUnifiedDialect,
  getEnabledUnifiedDialect,
} from "core/plugins/json-schema-unified/versions"
import {
  selectSchemaEntries,
  toPlainSchema,
} from "core/plugins/json-schema-unified/schemas"
import { getViewCacheKey } from "core/plugins/json-schema-unified/views"

const petSchema = {
  type: "object",
  properties: {
    id: { type: "integer", readOnly: true },
    password: { type: "string", writeOnly: true },
    name: { type: "string" },
  },
}

const documents = {
  "3.2": {
    openapi: "3.2.0",
    info: { title: "T", version: "1" },
    components: { schemas: { Pet: petSchema, Tag: { type: "string" } } },
  },
  "3.1": {
    openapi: "3.1.0",
    info: { title: "T", version: "1" },
    components: { schemas: { Pet: petSchema, Tag: { type: "string" } } },
  },
  "3.0": {
    openapi: "3.0.3",
    info: { title: "T", version: "1" },
    components: { schemas: { Pet: petSchema } },
  },
  "2.0": {
    swagger: "2.0",
    info: { title: "T", version: "1" },
    definitions: { Pet: petSchema },
  },
  undetected: { info: { title: "T", version: "1" } },
} as const

type Version = keyof typeof documents

const JumpToPath = ({ path }: { path: List<string> }) => (
  <span data-test-jump-to-path={path.join("/")} />
)

const TestPlugin = () => ({
  fn: { componentDidCatch: noop },
  components: { JumpToPath, Markdown, Collapse },
})

/**
 * The apis preset's plugins that matter here, in preset order, plus the core
 * components they use (the full preset loads swagger-client's ES modules,
 * which Jest does not transform).
 * json-schema-unified comes last, after every OpenAPI plugin.
 */
const plugins = [
  UtilPlugin,
  LogsPlugin,
  ViewPlugin,
  SpecPlugin,
  IconsPlugin,
  LayoutPlugin,
  JSONSchema5Plugin,
  DeepLinkingPlugin,
  SafeRenderPlugin(),
  OpenAPI30Plugin,
  JSONSchema202012Plugin,
  OpenAPI31Plugin,
  OpenAPI32Plugin,
  JSONSchemaUnifiedPlugin,
]

const makeSystem = (
  version: Version,
  configs: Record<string, unknown> = {},
  extraPlugins: unknown[] = []
) => {
  const system = new System({
    plugins: [...plugins, TestPlugin, ...extraPlugins],
    system: {
      configs: {
        defaultModelExpandDepth: 1,
        defaultModelsExpandDepth: 1,
        docExpansion: "list",
        ...configs,
      },
    },
  })
  system.getSystem().specActions.updateJsonSpec(fromJS(documents[version]))
  return system
}

const renderModel = (
  system: ReturnType<typeof makeSystem>,
  props: Record<string, unknown> = {}
) => {
  const { getComponent, getConfigs, specSelectors } = system.getSystem()
  const Model = getComponent("Model")

  return mount(
    <Provider store={system.getStore()}>
      <div>
        <Model
          schema={fromJS({ ...petSchema, $$ref: "#/components/schemas/Pet" })}
          name="Pet"
          specPath={List(["components", "schemas", "Pet"])}
          getComponent={getComponent}
          getConfigs={getConfigs}
          specSelectors={specSelectors}
          {...props}
        />
      </div>
    </Provider>
  )
}

const renderModels = (system: ReturnType<typeof makeSystem>) => {
  const Models = system.getSystem().getComponent("Models", true)
  return mount(
    <Provider store={system.getStore()}>
      <div>
        <Models />
      </div>
    </Provider>
  )
}

const propertyNames = (root: Element) =>
  Array.from(
    root.querySelectorAll(
      '[data-keyword="properties"] > ul > li > [data-json-schema-unified]'
    )
  ).map((element) => element.getAttribute("data-schema-name"))

describe("json-schema-unified Model / Models wrappers", () => {
  describe("version -> dialect mapping", () => {
    it("maps every version to its dialect, newest first", () => {
      expect(UNIFIED_DIALECTS.map(({ dialect }) => dialect)).toEqual([
        "oas32",
        "oas31",
        "oas30",
        "swagger2",
      ])
      expect(getUnifiedDialect({ isOAS32: () => true })).toBe("oas32")
      expect(
        getUnifiedDialect({ isOAS31: () => true, isOAS32: () => false })
      ).toBe("oas31")
      expect(
        getUnifiedDialect({
          isOAS30: () => true,
          isOAS31: () => false,
          isSwagger2: () => false,
        })
      ).toBe("oas30")
      expect(
        getUnifiedDialect({ isOAS30: () => false, isSwagger2: () => true })
      ).toBe("swagger2")
    })

    it.each([
      ["3.2", "oas32"],
      ["3.1", "oas31"],
      ["3.0", "oas30"],
      ["2.0", "swagger2"],
      ["undetected", null],
    ] as const)(
      "detects the %s document's dialect through the real selectors",
      (version, dialect) => {
        expect(
          getUnifiedDialect(makeSystem(version).getSystem().specSelectors)
        ).toBe(dialect)
      }
    )

    it("has no dialect for other or undetected versions", () => {
      expect(getUnifiedDialect({})).toBeNull()
      expect(getUnifiedDialect(undefined)).toBeNull()
      expect(
        getUnifiedDialect({
          isSwagger2: () => false,
          isOAS30: () => false,
          isOAS31: () => false,
          isOAS32: () => false,
        })
      ).toBeNull()
    })

    it("requires the option to be exactly true", () => {
      const specSelectors = { isOAS31: () => true }
      expect(
        getEnabledUnifiedDialect({ getConfigs: () => ({}), specSelectors })
      ).toBeNull()
      expect(
        getEnabledUnifiedDialect({
          getConfigs: () => ({ unifiedJSONSchemaEnabled: "true" }),
          specSelectors,
        })
      ).toBeNull()
      expect(
        getEnabledUnifiedDialect({
          getConfigs: () => ({ unifiedJSONSchemaEnabled: true }),
          specSelectors,
        })
      ).toBe("oas31")
    })
  })

  describe("Model gating", () => {
    it("renders the original Model for 3.1 when the option is off", () => {
      const root = renderModel(makeSystem("3.1")).getDOMNode()

      expect(root.querySelector("[data-json-schema-unified-model]")).toBeNull()
      expect(root.querySelector(".json-schema-2020-12")).not.toBeNull()
    })

    it.each(["2.0", "3.0", "3.1", "3.2"] as const)(
      "renders the unified Model for %s when the option is on",
      (version) => {
        const wrapper = renderModel(
          makeSystem(version, { unifiedJSONSchemaEnabled: true })
        )
        const root = wrapper.getDOMNode()

        expect(
          root.querySelector("[data-json-schema-unified-model]")
        ).not.toBeNull()
        expect(root.querySelector(".json-schema-2020-12")).toBeNull()
        expect(
          root
            .querySelector("[data-json-schema-unified]")
            .getAttribute("data-schema-name")
        ).toBe("Pet")
      }
    )

    it("configures the unified instance with the document's dialect", () => {
      const dialectOf = (version: Version) =>
        renderModel(makeSystem(version, { unifiedJSONSchemaEnabled: true }))
          .find("Model")
          .filterWhere((node) => node.prop("dialect") !== undefined)
          .first()
          .prop("dialect")

      expect(dialectOf("3.1")).toBe("oas31")
      expect(dialectOf("3.2")).toBe("oas32")
      expect(dialectOf("3.0")).toBe("oas30")
      expect(dialectOf("2.0")).toBe("swagger2")
    })

    it.each(["3.0", "2.0"] as const)(
      "renders the original Model for %s when the option is off",
      (version) => {
        const root = renderModel(makeSystem(version)).getDOMNode()

        expect(
          root.querySelector("[data-json-schema-unified-model]")
        ).toBeNull()
        expect(root.querySelector(".model-box, .model")).not.toBeNull()
      }
    )

    it("names the 2.0/3.0 Schema tab schema by title, then by $$ref", () => {
      const nameOf = (version: Version, schema: Record<string, unknown>) =>
        renderModel(makeSystem(version, { unifiedJSONSchemaEnabled: true }), {
          schema: fromJS(schema),
        })
          .getDOMNode()
          .querySelector("[data-json-schema-unified]")
          .getAttribute("data-schema-name")

      expect(
        nameOf("2.0", { ...petSchema, $$ref: "#/definitions/Foo~1Bar" })
      ).toBe("Foo/Bar")
      expect(
        nameOf("3.0", {
          ...petSchema,
          title: "Animal",
          $$ref: "#/components/schemas/Pet",
        })
      ).toBe("Animal")
      // 3.1 keeps naming by `#/components/schemas/` $$ref only
      expect(
        nameOf("3.1", {
          ...petSchema,
          title: "Animal",
          $$ref: "#/components/schemas/Pet",
        })
      ).toBe("Pet")
      expect(
        nameOf("3.1", { ...petSchema, $$ref: "#/definitions/Pet" })
      ).toBeNull()
    })

    it.each(["undetected"] as const)(
      "renders the original Model for %s when the option is on",
      (version) => {
        const root = renderModel(
          makeSystem(version, { unifiedJSONSchemaEnabled: true })
        ).getDOMNode()

        expect(
          root.querySelector("[data-json-schema-unified-model]")
        ).toBeNull()
        expect(root.querySelector("[data-json-schema-unified]")).toBeNull()
      }
    )
  })

  describe("Model instances", () => {
    it("are cached per readOnly/writeOnly combination, not per page", () => {
      const system = makeSystem("3.1", { unifiedJSONSchemaEnabled: true })

      const request = renderModel(system, {
        includeReadOnly: false,
        includeWriteOnly: true,
      }).getDOMNode()
      const response = renderModel(system, {
        includeReadOnly: true,
        includeWriteOnly: false,
      }).getDOMNode()

      expect(propertyNames(request)).toEqual(["password", "name"])
      expect(propertyNames(response)).toEqual(["id", "name"])
    })

    it("builds distinct cache keys for distinct render inputs", () => {
      const options = {
        dialect: "oas31" as const,
        includeReadOnly: true,
        includeWriteOnly: false,
        defaultExpandedLevels: 1,
      }
      const key = getViewCacheKey("Model", options)

      expect(getViewCacheKey("Model", { ...options })).toBe(key)
      expect(getViewCacheKey("Models", options)).not.toBe(key)
      expect(
        getViewCacheKey("Model", { ...options, dialect: "oas32" })
      ).not.toBe(key)
      expect(
        getViewCacheKey("Model", { ...options, includeReadOnly: false })
      ).not.toBe(key)
      expect(
        getViewCacheKey("Model", { ...options, defaultExpandedLevels: 2 })
      ).not.toBe(key)
      expect(
        getViewCacheKey("Model", { ...options, showExtensions: true })
      ).not.toBe(key)
    })

    it("isolates a crash of the unified view in an error boundary", () => {
      const Broken = () => {
        throw new Error("broken")
      }
      const BrokenPlugin = () => ({
        components: { JSONSchemaUnifiedModel: Broken },
      })
      const system = makeSystem("3.1", { unifiedJSONSchemaEnabled: true }, [
        BrokenPlugin,
      ])
      const consoleError = jest.spyOn(console, "error").mockImplementation(noop)

      const wrapper = renderModel(system)
      consoleError.mockRestore()

      expect(wrapper.text()).toContain("Could not render")
    })
  })

  describe("Models", () => {
    it("renders the original Models for 3.1 when the option is off", () => {
      const root = renderModels(makeSystem("3.1")).getDOMNode()

      expect(root.querySelector("[data-json-schema-unified-models]")).toBeNull()
      expect(root.querySelector("section.models")).not.toBeNull()
    })

    it.each([
      ["3.1", "Schemas", ["Pet", "Tag"]],
      ["3.2", "Schemas", ["Pet", "Tag"]],
      ["3.0", "Schemas", ["Pet"]],
      ["2.0", "Models", ["Pet"]],
    ] as const)(
      "renders the unified Schemas section for %s",
      (version, heading, names) => {
        const root = renderModels(
          makeSystem(version, { unifiedJSONSchemaEnabled: true })
        )
          .getDOMNode()
          .querySelector("[data-json-schema-unified-models]")

        expect(root.tagName).toBe("SECTION")
        expect(root.getAttribute("data-expanded")).toBe("true")
        expect(root.querySelector("h4").textContent).toBe(heading)
        expect(
          Array.from(
            root.querySelectorAll(
              '[data-json-schema-unified][data-json-schema-level="0"]'
            )
          ).map((element) => element.getAttribute("data-schema-name"))
        ).toEqual(names)
      }
    )

    it("renders JumpToPath with the spec path of every schema", () => {
      const root = renderModels(
        makeSystem("3.1", { unifiedJSONSchemaEnabled: true })
      ).getDOMNode()

      expect(
        Array.from(root.querySelectorAll("[data-test-jump-to-path]")).map(
          (element) => element.getAttribute("data-test-jump-to-path")
        )
      ).toEqual(["components/schemas/Pet", "components/schemas/Tag"])
    })

    it("collapses and expands the section through the layout state", () => {
      const system = makeSystem("3.1", { unifiedJSONSchemaEnabled: true })
      const wrapper = renderModels(system)

      wrapper.find("h4 button").simulate("click")
      expect(
        system.getSystem().layoutSelectors.isShown(["components", "schemas"])
      ).toBe(false)
      expect(
        wrapper
          .getDOMNode()
          .querySelector("[data-json-schema-unified-models]")
          .getAttribute("data-expanded")
      ).toBe("false")
    })

    it("is hidden when defaultModelsExpandDepth < 0", () => {
      const wrapper = renderModels(
        makeSystem("3.1", {
          unifiedJSONSchemaEnabled: true,
          defaultModelsExpandDepth: -1,
        })
      )

      expect(wrapper.getDOMNode().innerHTML).toBe("")
    })

    it.each([
      ["3.0", ["components", "schemas"]],
      ["2.0", ["definitions"]],
    ] as const)(
      "keys the %s section's layout state by its schemas path",
      (version, path) => {
        const system = makeSystem(version, { unifiedJSONSchemaEnabled: true })
        const root = renderModels(system).getDOMNode()

        expect(
          root
            .querySelector("[data-test-jump-to-path]")
            .getAttribute("data-test-jump-to-path")
        ).toBe([...path, "Pet"].join("/"))

        const pet = root.querySelector(
          '[data-json-schema-unified][data-schema-name="Pet"] button'
        ) as HTMLButtonElement
        pet.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        expect(
          system.getSystem().layoutSelectors.isShown([...path, "Pet"])
        ).toBe(true)
        ;(root.querySelector("h4 button") as HTMLButtonElement).dispatchEvent(
          new MouseEvent("click", { bubbles: true })
        )
        expect(system.getSystem().layoutSelectors.isShown([...path])).toBe(
          false
        )
      }
    )

    it.each(["3.0", "2.0"] as const)(
      "renders the original Models for %s when the option is off",
      (version) => {
        const root = renderModels(makeSystem(version)).getDOMNode()

        expect(
          root.querySelector("[data-json-schema-unified-models]")
        ).toBeNull()
        expect(root.querySelector("section.models")).not.toBeNull()
      }
    )
  })

  describe("schemas selector", () => {
    it("converts each Immutable schema to plain JS once", () => {
      const immutable = fromJS(petSchema)

      expect(toPlainSchema(immutable)).toEqual(petSchema)
      expect(toPlainSchema(immutable)).toBe(toPlainSchema(immutable))
      expect(toPlainSchema(true)).toBe(true)
    })

    it("returns stable entries, preferring resolved subtrees", () => {
      const specJson = fromJS(documents["3.1"])
      let resolved: unknown = undefined
      const specSelectors = {
        specJson: () => specJson,
        specResolvedSubtree: () => resolved,
      }

      const entries = selectSchemaEntries(specSelectors, "oas31")
      expect(entries.map(([name]) => name)).toEqual(["Pet", "Tag"])
      expect(selectSchemaEntries(specSelectors, "oas31")).toBe(entries)

      resolved = fromJS({ Tag: { type: "string", title: "Resolved" } })
      const resolvedEntries = selectSchemaEntries(specSelectors, "oas31")
      expect(resolvedEntries).not.toBe(entries)
      expect(resolvedEntries[0][1]).toBe(entries[0][1])
      expect(resolvedEntries[1][1]).toEqual({
        type: "string",
        title: "Resolved",
      })
    })

    it("returns no entries without schemas", () => {
      expect(
        selectSchemaEntries(
          {
            specJson: () => fromJS(documents.undetected),
            specResolvedSubtree: () => undefined,
          },
          "oas31"
        )
      ).toEqual([])
    })
  })
})
