/**
 * @prettier
 */
import React from "react"

import JSONSchema from "./components/JSONSchema/JSONSchema"
import Keyword$schema from "./components/keywords/$schema"
import Keyword$vocabulary from "./components/keywords/$vocabulary/$vocabulary"
import Keyword$id from "./components/keywords/$id"
import Keyword$anchor from "./components/keywords/$anchor"
import Keyword$dynamicAnchor from "./components/keywords/$dynamicAnchor"
import Keyword$ref from "./components/keywords/$ref"
import Keyword$dynamicRef from "./components/keywords/$dynamicRef"
import Keyword$defs from "./components/keywords/$defs"
import Keyword$comment from "./components/keywords/$comment"
import KeywordAllOf from "./components/keywords/AllOf"
import KeywordAnyOf from "./components/keywords/AnyOf"
import KeywordOneOf from "./components/keywords/OneOf"
import KeywordNot from "./components/keywords/Not"
import KeywordIf from "./components/keywords/If"
import KeywordThen from "./components/keywords/Then"
import KeywordElse from "./components/keywords/Else"
import KeywordDependentSchemas from "./components/keywords/DependentSchemas"
import KeywordPrefixItems from "./components/keywords/PrefixItems"
import KeywordItems from "./components/keywords/Items"
import KeywordContains from "./components/keywords/Contains"
import KeywordProperties from "./components/keywords/Properties/Properties"
import KeywordPatternProperties from "./components/keywords/PatternProperties/PatternProperties"
import KeywordAdditionalProperties from "./components/keywords/AdditionalProperties"
import KeywordPropertyNames from "./components/keywords/PropertyNames"
import KeywordUnevaluatedItems from "./components/keywords/UnevaluatedItems"
import KeywordUnevaluatedProperties from "./components/keywords/UnevaluatedProperties"
import KeywordType from "./components/keywords/Type"
import KeywordEnum from "./components/keywords/Enum/Enum"
import KeywordConst from "./components/keywords/Const/Const"
import KeywordConstraint from "./components/keywords/Constraint/Constraint"
import KeywordDependentRequired from "./components/keywords/DependentRequired/DependentRequired"
import KeywordContentSchema from "./components/keywords/ContentSchema"
import KeywordTitle from "./components/keywords/Title/Title"
import KeywordDescription from "./components/keywords/Description/Description"
import KeywordDefault from "./components/keywords/Default/Default"
import KeywordDeprecated from "./components/keywords/Deprecated"
import KeywordReadOnly from "./components/keywords/ReadOnly"
import KeywordWriteOnly from "./components/keywords/WriteOnly"
import KeywordExamples from "./components/keywords/Examples/Examples"
import ExtensionKeywords from "./components/keywords/ExtensionKeywords/ExtensionKeywords"
import JSONViewer from "./components/JSONViewer/JSONViewer"
import Accordion from "./components/Accordion/Accordion"
import ExpandDeepButton from "./components/ExpandDeepButton/ExpandDeepButton"
import ChevronRightIcon from "./components/icons/ChevronRight"
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

export const withJSONSchemaContext = (Component, overrides = {}) => {
  const value = {
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
      KeywordExamples,
      ExtensionKeywords,
      JSONViewer,
      Accordion,
      ExpandDeepButton,
      ChevronRightIcon,
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

export const makeWithJSONSchemaSystemContext =
  ({ getSystem }) =>
  (Component, overrides = {}) => {
    const { getComponent, getConfigs } = getSystem()
    const configs = getConfigs()

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
    const KeywordExamples = getComponent("JSONSchema202012KeywordExamples")
    const ExtensionKeywords = getComponent("JSONSchema202012ExtensionKeywords")
    const JSONViewer = getComponent("JSONSchema202012JSONViewer")
    const Accordion = getComponent("JSONSchema202012Accordion")
    const ExpandDeepButton = getComponent("JSONSchema202012ExpandDeepButton")
    const ChevronRightIcon = getComponent("JSONSchema202012ChevronRightIcon")

    return withJSONSchemaContext(Component, {
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
        KeywordExamples,
        ExtensionKeywords,
        JSONViewer,
        Accordion,
        ExpandDeepButton,
        ChevronRightIcon,
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
