/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS32ComponentWrapper } from "../fn"
import { makeGetSchemaKeywords } from "../json-schema-2020-12-extensions/fn"

const ModelWrapper = createOnlyOAS32ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const { getComponent, fn, getConfigs } = system
    const configs = getConfigs()

    const pathname = window?.location?.pathname ?? "/"
    const includeReadOnly = Boolean(props.includeReadOnly)
    const includeWriteOnly = Boolean(props.includeWriteOnly)
    // the HOC config depends on these props, so cache one HOC per combination
    const cacheKey = `${includeReadOnly}:${includeWriteOnly}`

    if (ModelWrapper.pathname !== pathname) {
      ModelWrapper.ModelWithJSONSchemaContext = {}
      ModelWrapper.pathname = pathname
    }

    const CachedModel = ModelWrapper.ModelWithJSONSchemaContext[cacheKey]
    if (CachedModel) {
      return <CachedModel {...props} />
    }

    const Model = getComponent("OAS31Model")
    const withJSONSchemaSystemContext = getComponent(
      "withJSONSchema202012SystemContext"
    )

    // we cache the HOC as recreating it with every re-render is quite expensive
    const ModelWithJSONSchemaContext = withJSONSchemaSystemContext(Model, {
      config: {
        default$schema: "https://spec.openapis.org/oas/3.2/schema/2025-09-17",
        defaultExpandedLevels: configs.defaultModelExpandDepth,
        includeReadOnly,
        includeWriteOnly,
      },
      fn: {
        getProperties: fn.jsonSchema202012.getProperties,
        isExpandable: fn.jsonSchema202012.isExpandable,
        getSchemaKeywords: makeGetSchemaKeywords(
          fn.jsonSchema202012.getSchemaKeywords
        ),
      },
    })
    ModelWrapper.ModelWithJSONSchemaContext[cacheKey] =
      ModelWithJSONSchemaContext

    return <ModelWithJSONSchemaContext {...props} />
  }
)

ModelWrapper.ModelWithJSONSchemaContext = {}
ModelWrapper.pathname = null

export default ModelWrapper
