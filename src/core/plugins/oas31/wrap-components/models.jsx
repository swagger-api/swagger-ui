/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"
import { makeGetSchemaKeywords } from "../json-schema-2020-12-extensions/fn"

const ModelsWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const { getComponent, fn, getConfigs } = getSystem()
  const configs = getConfigs()

  if (ModelsWrapper.ModelsWithJSONSchemaContext) {
    return <ModelsWrapper.ModelsWithJSONSchemaContext />
  }

  const Models = getComponent("OAS31Models", true)
  const withJSONSchemaSystemContext = getComponent(
    "withJSONSchema202012SystemContext"
  )

  // we cache the HOC as recreating it with every re-render is quite expensive
  ModelsWrapper.ModelsWithJSONSchemaContext ??= withJSONSchemaSystemContext(
    Models,
    {
      config: {
        default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
        defaultExpandedLevels: configs.defaultModelsExpandDepth - 1,
        includeReadOnly: true,
        includeWriteOnly: true,
      },
      fn: {
        getProperties: fn.jsonSchema202012.getProperties,
        isExpandable: fn.jsonSchema202012.isExpandable,
        getSchemaKeywords: makeGetSchemaKeywords(
          fn.jsonSchema202012.getSchemaKeywords
        ),
      },
    }
  )

  return <ModelsWrapper.ModelsWithJSONSchemaContext />
})

ModelsWrapper.ModelsWithJSONSchemaContext = null

export default ModelsWrapper
