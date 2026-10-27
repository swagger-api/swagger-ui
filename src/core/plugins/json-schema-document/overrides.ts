/**
 * @prettier
 */
import type React from "react"

import $recursiveAnchor from "./components/keywords/$recursiveAnchor"
import $recursiveRef from "./components/keywords/$recursiveRef"
import Definitions from "./components/keywords/Definitions"
import Dependencies from "./components/keywords/Dependencies"
import withBlankNames from "./components/keywords/DependentRequired"
import withKeyword from "./components/keywords/withKeyword"
import type { System } from "./components/keywords/types"
import {
  getDependentRequired,
  makeGetSchemaKeywords,
  makeIsExpandable,
} from "./fn"
import type { InstanceFn } from "./fn"

type Component = React.ComponentType<Record<string, unknown>>

export interface OverridesSystem extends System {
  fn: System["fn"] & {
    jsonSchema202012: System["fn"]["jsonSchema202012"] & {
      getSchemaKeywords: () => string[]
      getTitle: (schema: unknown) => string
      useFn: () => InstanceFn
    }
  }
}

/**
 * The components and `fn` of the json-schema-2020-12 renderer instance that
 * renders a JSON Schema 2020-12 document: the renderer's own, extended by the
 * keywords the default meta-schema keeps from earlier drafts
 * (`DEFAULT_META_SCHEMA_KEYWORDS`). None of the OpenAPI `fn` (`getProperties`,
 * the OpenAPI `isExpandable`) is passed. The registered "Required when
 * defined" component is wrapped, so that it lists the labels of `getNameLabel`
 * (`fn.ts`) for blank and label-like names, in the lists of `dependentRequired`
 * as well as those of `dependencies`.
 */
export const makeJSONSchema202012Overrides = (
  getSystem: () => OverridesSystem
) => {
  const { fn, getComponent } = getSystem()
  const { getSchemaKeywords, useFn } = fn.jsonSchema202012

  return {
    components: {
      Keyword$dynamicAnchor: withKeyword(
        getComponent("JSONSchema202012Keyword$dynamicAnchor") as Component,
        $recursiveAnchor,
        getSystem
      ),
      Keyword$dynamicRef: withKeyword(
        getComponent("JSONSchema202012Keyword$dynamicRef") as Component,
        $recursiveRef,
        getSystem
      ),
      Keyword$defs: withKeyword(
        getComponent("JSONSchema202012Keyword$defs") as Component,
        Definitions,
        getSystem
      ),
      KeywordDependentSchemas: withKeyword(
        getComponent("JSONSchema202012KeywordDependentSchemas") as Component,
        Dependencies,
        getSystem
      ),
      KeywordDependentRequired: withBlankNames(
        getComponent("JSONSchema202012KeywordDependentRequired") as Component
      ),
    },
    fn: {
      getSchemaKeywords: makeGetSchemaKeywords(getSchemaKeywords),
      isExpandable: makeIsExpandable(useFn),
      getDependentRequired,
    },
  }
}
