/**
 * @prettier
 */
import JSONSchema from "./components/JSONSchema/JSONSchema"
import Accordion from "./components/Accordion/Accordion"
import ExpandDeepButton from "./components/ExpandDeepButton/ExpandDeepButton"
import JSONViewer from "./components/JSONViewer/JSONViewer"
import ChevronRightIcon from "./components/icons/ChevronRight"
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
import KeywordOASDescription from "./components/keywords/oas/Description"
import KeywordOASExamples from "./components/keywords/oas/Examples"
import KeywordOASProperties from "./components/keywords/oas/Properties"
import KeywordDiscriminator from "./components/keywords/oas/Discriminator/Discriminator"
import KeywordXml from "./components/keywords/oas/Xml"
import KeywordExternalDocs from "./components/keywords/oas/ExternalDocs"
import KeywordExample from "./components/keywords/oas/Example"
import KeywordOpenAPIExtensions from "./components/keywords/oas/OpenAPIExtensions"
import KeywordSwagger2Discriminator from "./components/keywords/oas/Swagger2Discriminator"
import KeywordRefPath from "./components/keywords/oas/RefPath"
import KeywordSchemaName from "./components/keywords/oas/SchemaName"
import type { ComponentMap } from "./types"

/**
 * The renderer's components, keyed by their short context names (the names
 * `useComponent()` looks up). One map per group; add a group by defining a map
 * here and spreading it into `contextComponents`.
 *
 * Each component is registered on the system as `getSystemComponentName(name)`,
 * and the system HOC looks the same names up again, so a group added here is
 * registered, wrappable, and used by both HOCs without further changes.
 */
export const baseComponents = {
  JSONSchema,
  Accordion,
  ExpandDeepButton,
  JSONViewer,
  ChevronRightIcon,
}

export const coreKeywordComponents = {
  Keyword$schema,
  Keyword$vocabulary,
  Keyword$id,
  Keyword$anchor,
  Keyword$dynamicAnchor,
  Keyword$ref,
  Keyword$dynamicRef,
  Keyword$defs,
  Keyword$comment,
}

export const applicatorKeywordComponents = {
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
}

export const unevaluatedKeywordComponents = {
  KeywordUnevaluatedItems,
  KeywordUnevaluatedProperties,
}

export const validationKeywordComponents = {
  KeywordType,
  KeywordEnum,
  KeywordConst,
  KeywordConstraint,
  KeywordDependentRequired,
}

export const contentKeywordComponents = {
  KeywordContentSchema,
}

export const metaDataKeywordComponents = {
  KeywordTitle,
  KeywordDescription,
  KeywordDefault,
  KeywordDeprecated,
  KeywordReadOnly,
  KeywordWriteOnly,
  KeywordExamples,
}

export const extensionKeywordComponents = {
  ExtensionKeywords,
}

/**
 * OpenAPI keyword components. Registered for every instance but rendered only
 * by instances configured with an OAS dialect (`./dialects`): the dialect
 * points the `KeywordDescription`, `KeywordExamples` and `KeywordProperties`
 * slots at the `KeywordOAS*` components, and `KeywordOASExamples` renders the
 * other OAS keywords. The 2.0 dialect points the `KeywordDiscriminator` slot
 * at `KeywordSwagger2Discriminator`; `KeywordRefPath` renders only in the
 * 2.0/3.0 dialects (they set `fn.getRefPath`).
 */
export const oasKeywordComponents = {
  KeywordOASDescription,
  KeywordOASExamples,
  KeywordOASProperties,
  KeywordDiscriminator,
  KeywordXml,
  KeywordExternalDocs,
  KeywordExample,
  KeywordOpenAPIExtensions,
  KeywordSwagger2Discriminator,
  KeywordRefPath,
  KeywordSchemaName,
}

export const contextComponents: ComponentMap = {
  ...baseComponents,
  ...coreKeywordComponents,
  ...applicatorKeywordComponents,
  ...unevaluatedKeywordComponents,
  ...validationKeywordComponents,
  ...contentKeywordComponents,
  ...metaDataKeywordComponents,
  ...extensionKeywordComponents,
  ...oasKeywordComponents,
}

/**
 * `JSONSchema` -> `JSONSchemaUnified`, any other `Name` -> `JSONSchemaUnified{Name}`
 * (e.g. `KeywordProperties` -> `JSONSchemaUnifiedKeywordProperties`).
 */
export const getSystemComponentName = (contextName: string): string =>
  contextName === "JSONSchema"
    ? "JSONSchemaUnified"
    : `JSONSchemaUnified${contextName}`
