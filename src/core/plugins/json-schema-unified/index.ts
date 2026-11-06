/**
 * @prettier
 */
import { contextComponents, getSystemComponentName } from "./registry"
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
import {
  getOASDialectOverrides,
  getOASSchemaKeywords,
  getOASProperties,
  isOASExpandable,
} from "./dialects"
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
import Model from "./components/Model/Model"
import Models from "./components/Models/Models"
import ModelWrapper from "./wrap-components/model"
import ModelsWrapper from "./wrap-components/models"
import type { System } from "./hoc"
import type { JSONSchemaFn } from "./types"

interface PluginSystem {
  getSystem: () => System
  fn: { jsonSchemaUnified?: Partial<JSONSchemaFn> }
}

/**
 * The unified JSON Schema renderer. It registers its components and helpers,
 * and wraps `Model` (the Schema tab) and `Models` (the Schemas section): with
 * `unifiedJSONSchemaEnabled` on and a document version that has a unified
 * dialect (`./versions`), they render `JSONSchemaUnifiedModel(s)` instead of
 * the original view; otherwise the original renders unchanged.
 */
const JSONSchemaUnifiedPlugin = ({ getSystem, fn }: PluginSystem) => {
  const fnAccessor = () =>
    ({
      ...fn.jsonSchemaUnified,
    }) as JSONSchemaFn

  const registeredComponents = Object.fromEntries(
    Object.entries(contextComponents).map(([contextName, component]) => [
      getSystemComponentName(contextName),
      component,
    ])
  )

  return {
    components: {
      ...registeredComponents,
      withJSONSchemaUnifiedContext: withJSONSchemaContext,
      withJSONSchemaUnifiedSystemContext:
        makeWithJSONSchemaSystemContext(getSystem()),
      JSONSchemaUnifiedPathContext: () => JSONSchemaPathContext,
      JSONSchemaUnifiedLevelContext: () => JSONSchemaLevelContext,
      JSONSchemaUnifiedModel: Model,
      JSONSchemaUnifiedModels: Models,
    },
    wrapComponents: {
      Model: ModelWrapper,
      Models: ModelsWrapper,
    },
    fn: {
      jsonSchemaUnified: {
        upperFirst,
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
        getOASDialectOverrides,
        getOASSchemaKeywords,
        getOASProperties,
        isOASExpandable,
      },
    },
  }
}

export default JSONSchemaUnifiedPlugin
