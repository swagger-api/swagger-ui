/**
 * @prettier
 */
import type React from "react"

import Definitions from "./components/keywords/Definitions"
import withKeyword from "./components/keywords/withKeyword"
import type { System } from "./components/keywords/types"
import { makeGetSchemaKeywords, makeIsExpandable } from "./fn"
import type { InstanceFn } from "./fn"

type Component = React.ComponentType<Record<string, unknown>>

export interface OverridesSystem extends System {
  fn: System["fn"] & {
    jsonSchema202012: System["fn"]["jsonSchema202012"] & {
      getSchemaKeywords: () => string[]
      useFn: () => InstanceFn
    }
  }
}

/**
 * The components and `fn` of the json-schema-2020-12 renderer instance that
 * renders a JSON Schema 2020-12 document: the renderer's own, extended by the
 * keywords the default meta-schema keeps from earlier drafts
 * (`DEFAULT_META_SCHEMA_KEYWORDS`). None of the OpenAPI `fn` (`getProperties`,
 * the OpenAPI `isExpandable`) is passed.
 */
export const makeJSONSchema202012Overrides = (
  getSystem: () => OverridesSystem
) => {
  const { fn, getComponent } = getSystem()
  const { getSchemaKeywords, useFn } = fn.jsonSchema202012

  return {
    components: {
      Keyword$defs: withKeyword(
        getComponent("JSONSchema202012Keyword$defs") as Component,
        Definitions,
        getSystem
      ),
    },
    fn: {
      getSchemaKeywords: makeGetSchemaKeywords(getSchemaKeywords),
      isExpandable: makeIsExpandable(useFn),
    },
  }
}
