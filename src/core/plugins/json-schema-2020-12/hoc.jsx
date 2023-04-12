/**
 * @prettier
 */
import React from "react"

import JSONSchema from "./components/JSONSchema/JSONSchema"
import BooleanJSONSchema from "./components/BooleanJSONSchema/BooleanJSONSchema"
import JSONSchemaContext from "./context"
import { getTitle, isBooleanJSONSchema, upperFirst } from "./fn"

export const withJSONSchemaContext = (Component, overrides = {}) => {
  const value = {
    components: {
      JSONSchema,
      BooleanJSONSchema,
      ...overrides.components,
    },
    config: {
      default$schema: "https://json-schema.org/draft/2020-12/schema",
      ...overrides.config,
    },
    fn: {
      upperFirst,
      getTitle,
      isBooleanJSONSchema,
      ...overrides.fn,
    },
  }

  const HOC = (props) => (
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
