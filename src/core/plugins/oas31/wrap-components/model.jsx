/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const ModelWrapper = createOnlyOAS31ComponentWrapper(
  ({ getSystem, ...props }) => {
    const system = getSystem()
    const { getComponent, fn, getConfigs } = system
    const configs = getConfigs()

    const Model = getComponent("OAS31Model")
    const JSONSchema = getComponent("JSONSchema202012")
    const Keyword$schema = getComponent("JSONSchema202012Keyword$schema")
    const Keyword$vocabulary = getComponent(
      "JSONSchema202012Keyword$vocabulary"
    )
    const Keyword$id = getComponent("JSONSchema202012Keyword$id")
    const Keyword$anchor = getComponent("JSONSchema202012Keyword$anchor")
    const Keyword$dynamicAnchor = getComponent(
      "JSONSchema202012Keyword$dynamicAnchor"
    )
    const Keyword$ref = getComponent("JSONSchema202012Keyword$ref")
    const Keyword$dynamicRef = getComponent(
      "JSONSchema202012Keyword$dynamicRef"
    )
    const Keyword$defs = getComponent("JSONSchema202012Keyword$defs")
    const Keyword$comment = getComponent("JSONSchema202012Keyword$comment")
    const KeywordAllOf = getComponent("JSONSchema202012KeywordAllOf")
    const KeywordAnyOf = getComponent("JSONSchema202012KeywordAnyOf")
    const KeywordOneOf = getComponent("JSONSchema202012KeywordOneOf")
    const KeywordNot = getComponent("JSONSchema202012KeywordNot")
    const KeywordIf = getComponent("JSONSchema202012KeywordIf")
    const KeywordThen = getComponent("JSONSchema202012KeywordThen")
    const KeywordElse = getComponent("JSONSchema202012KeywordElse")
    const KeywordDependentSchemas = getComponent(
      "JSONSchema202012KeywordDependentSchemas"
    )
    const KeywordPrefixItems = getComponent(
      "JSONSchema202012KeywordPrefixItems"
    )
    const KeywordItems = getComponent("JSONSchema202012KeywordItems")
    const KeywordContains = getComponent("JSONSchema202012KeywordContains")
    const KeywordProperties = getComponent("JSONSchema202012KeywordProperties")
    const KeywordPatternProperties = getComponent(
      "JSONSchema202012KeywordPatternProperties"
    )
    const KeywordAdditionalProperties = getComponent(
      "JSONSchema202012KeywordAdditionalProperties"
    )
    const KeywordPropertyNames = getComponent(
      "JSONSchema202012KeywordPropertyNames"
    )
    const KeywordUnevaluatedItems = getComponent(
      "JSONSchema202012KeywordUnevaluatedItems"
    )
    const KeywordUnevaluatedProperties = getComponent(
      "JSONSchema202012KeywordUnevaluatedProperties"
    )
    const KeywordType = getComponent("JSONSchema202012KeywordType")
    const KeywordEnum = getComponent("JSONSchema202012KeywordEnum")
    const KeywordConst = getComponent("JSONSchema202012KeywordConst")
    const KeywordConstraint = getComponent("JSONSchema202012KeywordConstraint")
    const KeywordDependentRequired = getComponent(
      "JSONSchema202012KeywordDependentRequired"
    )
    const KeywordContentSchema = getComponent(
      "JSONSchema202012KeywordContentSchema"
    )
    const KeywordTitle = getComponent("JSONSchema202012KeywordTitle")
    const KeywordDescription = getComponent(
      "JSONSchema202012KeywordDescription"
    )
    const KeywordDefault = getComponent("JSONSchema202012KeywordDefault")
    const KeywordDeprecated = getComponent("JSONSchema202012KeywordDeprecated")
    const KeywordReadOnly = getComponent("JSONSchema202012KeywordReadOnly")
    const KeywordWriteOnly = getComponent("JSONSchema202012KeywordWriteOnly")
    const Accordion = getComponent("JSONSchema202012Accordion")
    const ExpandDeepButton = getComponent("JSONSchema202012ExpandDeepButton")
    const ChevronRightIcon = getComponent("JSONSchema202012ChevronRightIcon")
    const withSchemaContext = getComponent("withJSONSchema202012Context")

    const ModelWithJSONSchemaContext = withSchemaContext(Model, {
      config: {
        default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
        defaultExpandedLevels: configs.defaultModelExpandDepth,
        includeReadOnly: Boolean(props.includeReadOnly),
        includeWriteOnly: Boolean(props.includeWriteOnly),
      },
      components: {
        JSONSchema,
        Keyword$schema,
        Keyword$vocabulary,
        Keyword$id,
        Keyword$anchor,
        Keyword$dynamicAnchor,
        Keyword$ref,
        Keyword$dynamicRef,
        Keyword$defs,
        Keyword$comment,
        KeywordAllOf,
        KeywordAnyOf,
        KeywordOneOf,
        KeywordNot,
        KeywordIf,
        KeywordThen,
        KeywordElse,
        KeywordDependentSchemas,
        KeywordPrefixItems,
        KeywordItems,
        KeywordContains,
        KeywordProperties,
        KeywordPatternProperties,
        KeywordAdditionalProperties,
        KeywordPropertyNames,
        KeywordUnevaluatedItems,
        KeywordUnevaluatedProperties,
        KeywordType,
        KeywordEnum,
        KeywordConst,
        KeywordConstraint,
        KeywordDependentRequired,
        KeywordContentSchema,
        KeywordTitle,
        KeywordDescription,
        KeywordDefault,
        KeywordDeprecated,
        KeywordReadOnly,
        KeywordWriteOnly,
        Accordion,
        ExpandDeepButton,
        ChevronRightIcon,
      },
      fn: {
        upperFirst: fn.upperFirst,
        isExpandable: fn.jsonSchema202012.isExpandable,
        getProperties: fn.jsonSchema202012.getProperties,
      },
    })

    return <ModelWithJSONSchemaContext {...props} />
  }
)

export default ModelWrapper
