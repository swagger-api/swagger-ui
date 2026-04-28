/**
 * @prettier
 */
import JSONSchema from "./components/JSONSchema/JSONSchema"
import KeywordSchema from "./components/keywords/$schema"
import KeywordVocabulary from "./components/keywords/$vocabulary/$vocabulary"
import KeywordId from "./components/keywords/$id"
import KeywordAnchor from "./components/keywords/$anchor"
import KeywordDynamicAnchor from "./components/keywords/$dynamicAnchor"
import KeywordRef from "./components/keywords/$ref"
import KeywordDynamicRef from "./components/keywords/$dynamicRef"
import KeywordDefs from "./components/keywords/$defs"
import KeywordComment from "./components/keywords/$comment"
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
import {
  upperFirst,
  hasKeyword,
  makeGetTitle,
  makeGetType,
  makeIsExpandable,
  isBooleanJSONSchema,
  getSchemaKeywords,
  makeGetExtensionKeywords,
  hasSchemaType,
} from "./fn"
import { JSONSchemaPathContext, JSONSchemaLevelContext } from "./context"
import {
  useFn,
  useConfig,
  useComponent,
  useIsExpanded,
  usePath,
  useLevel,
} from "./hooks"
import { withJSONSchemaContext, makeWithJSONSchemaSystemContext } from "./hoc"

const JSONSchema202012Plugin = ({ getSystem, fn }) => {
  const fnAccessor = () => ({
    upperFirst: fn.upperFirst,
    ...fn.jsonSchema202012,
  })

  return {
    components: {
      JSONSchema202012: JSONSchema,
      JSONSchema202012Keyword$schema: KeywordSchema,
      JSONSchema202012Keyword$vocabulary: KeywordVocabulary,
      JSONSchema202012Keyword$id: KeywordId,
      JSONSchema202012Keyword$anchor: KeywordAnchor,
      JSONSchema202012Keyword$dynamicAnchor: KeywordDynamicAnchor,
      JSONSchema202012Keyword$ref: KeywordRef,
      JSONSchema202012Keyword$dynamicRef: KeywordDynamicRef,
      JSONSchema202012Keyword$defs: KeywordDefs,
      JSONSchema202012Keyword$comment: KeywordComment,
      JSONSchema202012KeywordAllOf: KeywordAllOf,
      JSONSchema202012KeywordAnyOf: KeywordAnyOf,
      JSONSchema202012KeywordOneOf: KeywordOneOf,
      JSONSchema202012KeywordNot: KeywordNot,
      JSONSchema202012KeywordIf: KeywordIf,
      JSONSchema202012KeywordThen: KeywordThen,
      JSONSchema202012KeywordElse: KeywordElse,
      JSONSchema202012KeywordDependentSchemas: KeywordDependentSchemas,
      JSONSchema202012KeywordPrefixItems: KeywordPrefixItems,
      JSONSchema202012KeywordItems: KeywordItems,
      JSONSchema202012KeywordContains: KeywordContains,
      JSONSchema202012KeywordProperties: KeywordProperties,
      JSONSchema202012KeywordPatternProperties: KeywordPatternProperties,
      JSONSchema202012KeywordAdditionalProperties: KeywordAdditionalProperties,
      JSONSchema202012KeywordPropertyNames: KeywordPropertyNames,
      JSONSchema202012KeywordUnevaluatedItems: KeywordUnevaluatedItems,
      JSONSchema202012KeywordUnevaluatedProperties:
        KeywordUnevaluatedProperties,
      JSONSchema202012KeywordType: KeywordType,
      JSONSchema202012KeywordEnum: KeywordEnum,
      JSONSchema202012KeywordConst: KeywordConst,
      JSONSchema202012KeywordConstraint: KeywordConstraint,
      JSONSchema202012KeywordDependentRequired: KeywordDependentRequired,
      JSONSchema202012KeywordContentSchema: KeywordContentSchema,
      JSONSchema202012KeywordTitle: KeywordTitle,
      JSONSchema202012KeywordDescription: KeywordDescription,
      JSONSchema202012KeywordDefault: KeywordDefault,
      JSONSchema202012KeywordDeprecated: KeywordDeprecated,
      JSONSchema202012KeywordReadOnly: KeywordReadOnly,
      JSONSchema202012KeywordWriteOnly: KeywordWriteOnly,
      JSONSchema202012KeywordExamples: KeywordExamples,
      JSONSchema202012ExtensionKeywords: ExtensionKeywords,
      JSONSchema202012JSONViewer: JSONViewer,
      JSONSchema202012Accordion: Accordion,
      JSONSchema202012ExpandDeepButton: ExpandDeepButton,
      JSONSchema202012ChevronRightIcon: ChevronRightIcon,
      withJSONSchema202012Context: withJSONSchemaContext,
      withJSONSchema202012SystemContext:
        makeWithJSONSchemaSystemContext(getSystem()),
      JSONSchema202012PathContext: () => JSONSchemaPathContext,
      JSONSchema202012LevelContext: () => JSONSchemaLevelContext,
    },
    fn: {
      upperFirst,
      jsonSchema202012: {
        getTitle: makeGetTitle(fnAccessor),
        getType: makeGetType(fnAccessor),
        isExpandable: makeIsExpandable(fnAccessor),
        isBooleanJSONSchema,
        hasKeyword,
        useFn,
        useConfig,
        useComponent,
        useIsExpanded,
        usePath,
        useLevel,
        getSchemaKeywords,
        getExtensionKeywords: makeGetExtensionKeywords(fnAccessor),
        hasSchemaType,
      },
    },
  }
}

export default JSONSchema202012Plugin
