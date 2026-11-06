/**
 * @prettier
 */
import React from "react"

import { contextComponents, getSystemComponentName } from "./registry"
import { JSONSchemaContext } from "./context"
import { useFn } from "./hooks"
import {
  makeGetTitle,
  isBooleanJSONSchema,
  upperFirst,
  makeGetType,
  hasKeyword,
  makeIsExpandable,
  stringify,
  stringifyConstraints,
  getDependentRequired,
  getSchemaKeywords,
  makeGetExtensionKeywords,
} from "./fn"
import type {
  ComponentMap,
  JSONSchemaContextValue,
  JSONSchemaOverrides,
} from "./types"

export interface System {
  getSystem: () => System
  getComponent: (name: string) => ComponentMap[string]
  getConfigs: () => { showExtensions?: boolean }
}

export const withJSONSchemaContext = (
  Component: React.ComponentType<Record<string, unknown>>,
  overrides: JSONSchemaOverrides = {}
) => {
  const value = {
    components: {
      ...contextComponents,
      ...overrides.components,
    },
    config: {
      default$schema: "https://json-schema.org/draft/2020-12/schema",
      /**
       * Defines an upper exclusive boundary of the level range for automatic expansion.
       *
       * 0 -> do nothing
       * 1 -> [0]...(1)
       * 2 -> [0]...(2)
       * 3 -> [0]...(3)
       */
      defaultExpandedLevels: 0, // 2 = 0...2
      showExtensionKeywords: true,
      ...overrides.config,
    },
    fn: {
      upperFirst,
      getTitle: makeGetTitle(useFn),
      getType: makeGetType(useFn),
      isBooleanJSONSchema,
      hasKeyword,
      isExpandable: makeIsExpandable(useFn),
      stringify,
      stringifyConstraints,
      getDependentRequired,
      getSchemaKeywords,
      getExtensionKeywords: makeGetExtensionKeywords(useFn),
      ...overrides.fn,
    },
    state: { paths: {} },
  } as JSONSchemaContextValue

  const HOC = (props: Record<string, unknown>) => (
    <JSONSchemaContext.Provider value={value}>
      <Component {...props} />
    </JSONSchemaContext.Provider>
  )
  HOC.contexts = {
    JSONSchemaContext,
  }
  HOC.displayName = Component.displayName

  return HOC
}

/**
 * Components of other plugins an instance may use, keyed by the same name in
 * the system and in the instance: `Markdown` (core provider, DOMPurify) for
 * the OAS dialects' markdown descriptions.
 */
export const systemProvidedComponents = ["Markdown"]

export const makeWithJSONSchemaSystemContext =
  ({ getSystem }: Pick<System, "getSystem">) =>
  (
    Component: React.ComponentType<Record<string, unknown>>,
    overrides: JSONSchemaOverrides = {}
  ) => {
    const { getComponent, getConfigs } = getSystem()
    const configs = getConfigs()

    const systemComponents: ComponentMap = Object.fromEntries(
      Object.keys(contextComponents).map((contextName) => [
        contextName,
        getComponent(getSystemComponentName(contextName)),
      ])
    )

    const providedComponents: ComponentMap = Object.fromEntries(
      systemProvidedComponents.map((name) => [name, getComponent(name)])
    )

    return withJSONSchemaContext(Component, {
      components: {
        ...providedComponents,
        ...systemComponents,
        ...overrides.components,
      },
      config: {
        showExtensionKeywords: configs.showExtensions,
        ...overrides.config,
      },
      fn: {
        ...overrides.fn,
      },
    })
  }
