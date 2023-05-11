/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Contact from "./components/contact"
import Info from "./components/info"
import JsonSchemaDialect from "./components/json-schema-dialect"
import VersionPragmaFilter from "./components/version-pragma-filter"
import Models from "./components/models"
import LicenseWrapper from "./wrap-components/license"
import ContactWrapper from "./wrap-components/contact"
import InfoWrapper from "./wrap-components/info"
import ModelsWrapper from "./wrap-components/models"
import VersionPragmaFilterWrapper from "./wrap-components/version-pragma-filter"
import VersionStampWrapper from "./wrap-components/version-stamp"
import JSONSchema202012KeywordDescriptionWrapper from "./json-schema-2020-12-extensions/wrap-components/keywords/Description"
import {
  license as selectLicense,
  contact as selectContact,
  webhooks as selectWebhooks,
  selectLicenseNameField,
  selectLicenseUrlField,
  selectLicenseIdentifierField,
  selectContactNameField,
  selectContactEmailField,
  selectContactUrlField,
  selectContactUrl,
  isOAS31 as selectIsOAS31,
  selectLicenseUrl,
  selectInfoTitleField,
  selectInfoSummaryField,
  selectInfoDescriptionField,
  selectInfoTermsOfServiceField,
  selectInfoTermsOfServiceUrl,
  selectExternalDocsDescriptionField,
  selectExternalDocsUrlField,
  selectExternalDocsUrl,
  selectWebhooksOperations,
  selectJsonSchemaDialectField,
  selectJsonSchemaDialectDefault,
  selectSchemas,
} from "./spec-extensions/selectors"
import {
  isOAS3 as isOAS3SelectorWrapper,
  selectLicenseUrl as selectLicenseUrlWrapper,
} from "./spec-extensions/wrap-selectors"
import { selectLicenseUrl as selectOAS31LicenseUrl } from "./selectors"
import {
  isOAS31 as isOAS31Fn,
  createOnlyOAS31Selector as createOnlyOAS31SelectorFn,
  createSystemSelector as createSystemSelectorFn,
} from "./fn"

const OAS31Plugin = ({ fn }) => {
  const createSystemSelector = fn.createSystemSelector || createSystemSelectorFn
  const createOnlyOAS31Selector = fn.createOnlyOAS31Selector || createOnlyOAS31SelectorFn // prettier-ignore

  return {
    fn: {
      isOAs31: isOAS31Fn,
      createSystemSelector: createSystemSelectorFn,
      createOnlyOAS31Selector: createOnlyOAS31SelectorFn,
    },
    components: {
      Webhooks,
      JsonSchemaDialect,
      OAS31Info: Info,
      OAS31License: License,
      OAS31Contact: Contact,
      OAS31VersionPragmaFilter: VersionPragmaFilter,
      OAS31Models: Models,
    },
    wrapComponents: {
      InfoContainer: InfoWrapper,
      License: LicenseWrapper,
      Contact: ContactWrapper,
      VersionPragmaFilter: VersionPragmaFilterWrapper,
      VersionStamp: VersionStampWrapper,
      Models: ModelsWrapper,
      JSONSchema202012KeywordDescription:
        JSONSchema202012KeywordDescriptionWrapper,
    },
    statePlugins: {
      spec: {
        selectors: {
          isOAS31: createSystemSelector(selectIsOAS31),

          license: selectLicense,
          selectLicenseNameField,
          selectLicenseUrlField,
          selectLicenseIdentifierField: createOnlyOAS31Selector(selectLicenseIdentifierField), // prettier-ignore
          selectLicenseUrl: createSystemSelector(selectLicenseUrl),

          contact: selectContact,
          selectContactNameField,
          selectContactEmailField,
          selectContactUrlField,
          selectContactUrl: createSystemSelector(selectContactUrl),

          selectInfoTitleField,
          selectInfoSummaryField: createOnlyOAS31Selector(selectInfoSummaryField), // prettier-ignore
          selectInfoDescriptionField,
          selectInfoTermsOfServiceField,
          selectInfoTermsOfServiceUrl: createSystemSelector(selectInfoTermsOfServiceUrl), // prettier-ignore

          selectExternalDocsDescriptionField,
          selectExternalDocsUrlField,
          selectExternalDocsUrl: createSystemSelector(selectExternalDocsUrl),

          webhooks: createOnlyOAS31Selector(selectWebhooks),
          selectWebhooksOperations: createOnlyOAS31Selector(createSystemSelector(selectWebhooksOperations)), // prettier-ignore

          selectJsonSchemaDialectField,
          selectJsonSchemaDialectDefault,

          selectSchemas: createSystemSelector(selectSchemas),
        },
        wrapSelectors: {
          isOAS3: isOAS3SelectorWrapper,
          selectLicenseUrl: selectLicenseUrlWrapper,
        },
      },
      oas31: {
        selectors: {
          selectLicenseUrl: createOnlyOAS31Selector(createSystemSelector(selectOAS31LicenseUrl)), // prettier-ignore
        },
      },
    },
  }
}

export default OAS31Plugin
