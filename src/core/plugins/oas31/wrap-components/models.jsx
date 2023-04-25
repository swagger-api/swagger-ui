/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const ModelsWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const { getComponent, fn, getConfigs } = getSystem()
  const configs = getConfigs()

  if (ModelsWrapper.ModelsWithJSONContext) {
    return <ModelsWrapper.ModelsWithJSONContext />
  }

  const Models = getComponent("OAS31Models", true)
  const JSONSchema = getComponent("JSONSchema202012")
  const Keyword$schema = getComponent("JSONSchema202012Keyword$schema")
  const Keyword$vocabulary = getComponent("JSONSchema202012Keyword$vocabulary")
  const Keyword$id = getComponent("JSONSchema202012Keyword$id")
  const Keyword$anchor = getComponent("JSONSchema202012Keyword$anchor")
  const Keyword$dynamicAnchor = getComponent(
    "JSONSchema202012Keyword$dynamicAnchor"
  )
  const Keyword$ref = getComponent("JSONSchema202012Keyword$ref")
  const Keyword$dynamicRef = getComponent("JSONSchema202012Keyword$dynamicRef")
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
  const KeywordPrefixItems = getComponent("JSONSchema202012KeywordPrefixItems")
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
  const KeywordFormat = getComponent("JSONSchema202012KeywordFormat")
  const KeywordTitle = getComponent("JSONSchema202012KeywordTitle")
  const KeywordDescription = getComponent(
    "JSONSchema202012KeywordDescription",
    true
  )
  const Accordion = getComponent("JSONSchema202012Accordion")
  const ExpandDeepButton = getComponent("JSONSchema202012ExpandDeepButton")
  const ChevronRightIcon = getComponent("JSONSchema202012ChevronRightIcon")
  const withSchemaContext = getComponent("withJSONSchema202012Context")

  ModelsWrapper.ModelsWithJSONContext = withSchemaContext(Models, {
    config: {
      default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
      defaultExpandedLevels: configs.defaultModelsExpandDepth - 1,
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
      KeywordFormat,
      KeywordTitle,
      KeywordDescription,
      Accordion,
      ExpandDeepButton,
      ChevronRightIcon,
    },
    fn: {
      upperFirst: fn.upperFirst,
    },
  })

  return <ModelsWrapper.ModelsWithJSONContext />
})

ModelsWrapper.ModelsWithJSONContext = null

export default ModelsWrapper
