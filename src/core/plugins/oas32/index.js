/**
 * @prettier
 */
import Info from "./components/info"
import VersionPragmaFilter from "./components/version-pragma-filter"
import InfoWrapper from "./wrap-components/info"
import VersionPragmaFilterWrapper from "./wrap-components/version-pragma-filter"
import {
  isOAS32 as isOAS32Fn,
  createOnlyOAS32Selector as createOnlyOAS32SelectorFn,
  createSystemSelector as createSystemSelectorFn,
} from "./fn"
import {
  selectIsOAS32,
  selectHasQueryOperations,
} from "./spec-extensions/selectors"
import { validOperationMethods } from "./selectors"
import {
  isOAS3 as isOAS3SelectorWrapper,
  isOAS31 as isOAS31SelectorWrapper,
  operationsWithRootInherited as operationsWithRootInheritedWrapper,
  validOperationMethods as validOperationMethodsWrapper,
} from "./spec-extensions/wrap-selectors"
// Import license, contact, and info selectors from OAS31 plugin (OAS32 uses the same)
import {
  license as selectLicense,
  contact as selectContact,
  selectLicenseNameField,
  selectLicenseUrlField,
  selectLicenseIdentifierField,
  selectContactNameField,
  selectContactEmailField,
  selectContactUrlField,
  selectContactUrl,
  selectLicenseUrl,
  selectInfoSummaryField,
} from "../oas31/spec-extensions/selectors"
import afterLoad from "./after-load"

/**
 * OpenAPI 3.2 Plugin
 *
 * Adds support for OpenAPI Specification 3.2.x
 *
 * This plugin should be loaded AFTER:
 * - oas31 plugin
 * - json-schema-2020-12 plugin (uses same as OAS 3.1)
 *
 * It wraps and overrides components/selectors from previous versions.
 *
 * New features in OAS 3.2 (basic implementation):
 * - query operation: QUERY HTTP method support
 * - info.summary: Short summary field in Info Object
 *
 * Additional features (not yet implemented):
 * - $self: Self-referencing URI for base URI resolution
 * - additionalOperations: Custom HTTP methods support
 * - mediaTypes in Components: Reusable Media Type Objects
 * - pathItems in Components: Reusable Path Item Objects
 * - Tag enhancements (summary, kind, parent)
 * - querystring parameter location
 * - itemSchema for streaming responses
 */
const OAS32Plugin = ({ fn }) => {
  const createSystemSelector = fn.createSystemSelector || createSystemSelectorFn
  const createOnlyOAS32Selector =
    fn.createOnlyOAS32Selector || createOnlyOAS32SelectorFn

  const plugin = {
    afterLoad,
    fn: {
      isOAS32: isOAS32Fn,
      createSystemSelector: createSystemSelectorFn,
      createOnlyOAS32Selector: createOnlyOAS32SelectorFn,
    },
    components: {
      OAS32Info: Info,
      OAS32VersionPragmaFilter: VersionPragmaFilter,
    },
    wrapComponents: {
      InfoContainer: InfoWrapper,
      VersionPragmaFilter: VersionPragmaFilterWrapper,
    },
    statePlugins: {
      spec: {
        selectors: {
          isOAS32: createSystemSelector(selectIsOAS32),

          // Info selectors (inherited from OAS31)
          selectInfoSummaryField,

          // License and contact selectors (inherited from OAS31)
          license: selectLicense,
          selectLicenseNameField,
          selectLicenseUrlField,
          selectLicenseIdentifierField,
          selectLicenseUrl: createSystemSelector(selectLicenseUrl),

          contact: selectContact,
          selectContactNameField,
          selectContactEmailField,
          selectContactUrlField,
          selectContactUrl: createSystemSelector(selectContactUrl),

          // Path Item Object fields
          selectHasQueryOperations: createOnlyOAS32Selector(
            selectHasQueryOperations
          ),
        },
        wrapSelectors: {
          // Ensure OAS 3.2 specs are recognized as OAS 3.x (for servers, etc.)
          isOAS3: isOAS3SelectorWrapper,
          // Ensure OAS 3.2 specs are not detected as OAS 3.1
          isOAS31: isOAS31SelectorWrapper,
          // Add QUERY operations after base operations are collected (wraps operationsWithRootInherited)
          operationsWithRootInherited: operationsWithRootInheritedWrapper,
          // Override validOperationMethods to include QUERY for OAS 3.2
          validOperationMethods: validOperationMethodsWrapper,
        },
      },
      oas32: {
        selectors: {
          validOperationMethods,
        },
      },
    },
  }

  return plugin
}

export default OAS32Plugin
