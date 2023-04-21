/**
 * @prettier
 */
import React from "react"

import { createOnlyOAS31ComponentWrapper } from "../fn"

const ModelsWrapper = createOnlyOAS31ComponentWrapper(({ getSystem }) => {
  const { getComponent, fn } = getSystem()
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
  const KeywordProperties = getComponent("JSONSchema202012KeywordProperties")
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
  const ModelsWithJSONContext = withSchemaContext(Models, {
    config: {
      default$schema: "https://spec.openapis.org/oas/3.1/dialect/base",
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
      KeywordProperties,
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

  return <ModelsWithJSONContext />
})

export default ModelsWrapper
