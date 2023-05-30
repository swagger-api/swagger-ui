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
import KeywordConst from "./components/keywords/Const"
import KeywordConstraint from "./components/keywords/Constraint/Constraint"
import KeywordDependentRequired from "./components/keywords/DependentRequired/DependentRequired"
import KeywordContentSchema from "./components/keywords/ContentSchema"
import KeywordTitle from "./components/keywords/Title/Title"
import KeywordDescription from "./components/keywords/Description/Description"
import KeywordDefault from "./components/keywords/Default"
import KeywordDeprecated from "./components/keywords/Deprecated"
import KeywordReadOnly from "./components/keywords/ReadOnly"
import KeywordWriteOnly from "./components/keywords/WriteOnly"
import Accordion from "./components/Accordion/Accordion"
import ExpandDeepButton from "./components/ExpandDeepButton/ExpandDeepButton"
import ChevronRightIcon from "./components/icons/ChevronRight"
import { JSONSchemaContext } from "./context"
import {
  getTitle,
  isBooleanJSONSchema,
  upperFirst,
  getType,
  hasKeyword,
  isExpandable,
  stringify,
  stringifyConstraints,
  getDependentRequired,
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
      ...overrides.config,
    },
    fn: {
      upperFirst,
      getTitle,
      getType,
      isBooleanJSONSchema,
      hasKeyword,
      isExpandable,
      stringify,
      stringifyConstraints,
      getDependentRequired,
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
