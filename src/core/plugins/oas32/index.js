/**
 * @prettier
 */
import Info from "./components/info"
import SelfUri from "./components/self-uri"
import VersionPragmaFilter from "./components/version-pragma-filter"
import AdditionalOperations from "./components/additional-operations"
import MediaTypes from "./components/media-types"
import InfoWrapper from "./wrap-components/info"
import VersionPragmaFilterWrapper from "./wrap-components/version-pragma-filter"
import OperationTagWrapper from "./wrap-components/operation-tag"
import {
  isOAS32 as isOAS32Fn,
  createOnlyOAS32Selector as createOnlyOAS32SelectorFn,
  createSystemSelector as createSystemSelectorFn,
} from "./fn"
import {
  selectIsOAS32,
  selectSelfUriField,
  selectMediaTypes,
  selectPathItems,
  selectHasQueryOperations,
  selectHasAdditionalOperations,
  selectAdditionalOperations,
  selectTagSummaryField,
  selectTagKindField,
  selectTagParentField,
} from "./spec-extensions/selectors"
import { validOperationMethods } from "./selectors"
import {
  isOAS3 as isOAS3SelectorWrapper,
  isOAS31 as isOAS31SelectorWrapper,
  validOperationMethods as validOperationMethodsWrapper,
} from "./spec-extensions/wrap-selectors"
// Import license and contact selectors from OAS31 plugin (OAS32 uses the same)
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
 * New features in OAS 3.2:
 * - $self: Self-referencing URI for base URI resolution
 * - query operation: QUERY HTTP method support
 * - additionalOperations: Custom HTTP methods support
 * - mediaTypes in Components: Reusable Media Type Objects
 * - pathItems in Components: Reusable Path Item Objects
 */
const OAS32Plugin = ({ fn }) => {
  const createSystemSelector = fn.createSystemSelector || createSystemSelectorFn
  const createOnlyOAS32Selector =
    fn.createOnlyOAS32Selector || createOnlyOAS32SelectorFn

  return {
    afterLoad,
    fn: {
      isOAS32: isOAS32Fn,
      createSystemSelector: createSystemSelectorFn,
      createOnlyOAS32Selector: createOnlyOAS32SelectorFn,
    },
    components: {
      OAS32Info: Info,
      SelfUri,
      OAS32VersionPragmaFilter: VersionPragmaFilter,
      AdditionalOperations,
      MediaTypes,
    },
    wrapComponents: {
      InfoContainer: InfoWrapper,
      VersionPragmaFilter: VersionPragmaFilterWrapper,
      OperationTag: OperationTagWrapper,
    },
    statePlugins: {
      spec: {
        selectors: {
          isOAS32: createSystemSelector(selectIsOAS32),

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

          // $self field
          selectSelfUriField: createOnlyOAS32Selector(selectSelfUriField),

          // Components Object fields
          selectMediaTypes: createOnlyOAS32Selector(selectMediaTypes),
          selectPathItems: createOnlyOAS32Selector(selectPathItems),

          // Path Item Object fields
          selectHasQueryOperations: createOnlyOAS32Selector(
            selectHasQueryOperations
          ),
          selectHasAdditionalOperations: createOnlyOAS32Selector(
            selectHasAdditionalOperations
          ),
          selectAdditionalOperations: createOnlyOAS32Selector(
            selectAdditionalOperations
          ),

          // Tag Object fields (OAS 3.2)
          selectTagSummaryField: createOnlyOAS32Selector(selectTagSummaryField),
          selectTagKindField: createOnlyOAS32Selector(selectTagKindField),
          selectTagParentField: createOnlyOAS32Selector(selectTagParentField),
        },
        wrapSelectors: {
          // Ensure OAS 3.2 specs are recognized as OAS 3.x (for servers, etc.)
          isOAS3: isOAS3SelectorWrapper,
          // Ensure OAS 3.2 specs are not detected as OAS 3.1
          isOAS31: isOAS31SelectorWrapper,
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
}

export default OAS32Plugin
