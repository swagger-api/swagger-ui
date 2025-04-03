/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"
import { makeGetSchemaKeywords } from "../json-schema-2020-12-extensions/fn"

const ModelWrapper = createOnlyOAS31ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const { getComponent, fn, getConfigs } = system
    const configs = getConfigs()

    const Model = getComponent("OAS31Model")
    const withJSONSchemaSystemContext = getComponent(
      "withJSONSchema202012SystemContext"
    )

    // we cache the HOC as recreating it with every re-render is quite expensive
    ModelWrapper.ModelWithJSONSchemaContext ??= withJSONSchemaSystemContext(
      Model,
      {
        config: {
          default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
          defaultExpandedLevels: configs.defaultModelExpandDepth,
          includeReadOnly: props.includeReadOnly,
          includeWriteOnly: props.includeWriteOnly,
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

    return <ModelWrapper.ModelWithJSONSchemaContext {...props} />
  }
)

export default ModelWrapper
