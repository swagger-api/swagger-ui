/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Contact from "./components/contact"
import Info from "./components/info"
import JsonSchemaDialect from "./components/json-schema-dialect"
import VersionPragmaFilter from "./components/version-pragma-filter"
import Model from "./components/model/model"
import Models from "./components/models/models"
import MutualTLSAuth from "./components/auth/mutual-tls-auth"
import Auths from "./components/auth/auths"
import LicenseWrapper from "./wrap-components/license"
import ContactWrapper from "./wrap-components/contact"
import InfoWrapper from "./wrap-components/info"
import ModelWrapper from "./wrap-components/model"
import ModelsWrapper from "./wrap-components/models"
import VersionPragmaFilterWrapper from "./wrap-components/version-pragma-filter"
import AuthItemWrapper from "./wrap-components/auth/auth-item"
import AuthsWrapper from "./wrap-components/auths"
import {
  isOAS31 as isOAS31Fn,
  createOnlyOAS31Selector as createOnlyOAS31SelectorFn,
  createSystemSelector as createSystemSelectorFn,
} from "./fn"
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
import { definitionsToAuthorize as definitionsToAuthorizeWrapper } from "./auth-extensions/wrap-selectors"
import { selectLicenseUrl as selectOAS31LicenseUrl } from "./selectors"
import JSONSchema202012KeywordExample from "./json-schema-2020-12-extensions/components/keywords/Example"
import JSONSchema202012KeywordXml from "./json-schema-2020-12-extensions/components/keywords/Xml"
import JSONSchema202012KeywordDiscriminator from "./json-schema-2020-12-extensions/components/keywords/Discriminator/Discriminator"
import OpenAPIExtensions from "./json-schema-2020-12-extensions/components/keywords/OpenAPIExtensions"
import JSONSchema202012KeywordExternalDocs from "./json-schema-2020-12-extensions/components/keywords/ExternalDocs"
import JSONSchema202012KeywordDescriptionWrapper from "./json-schema-2020-12-extensions/wrap-components/keywords/Description"
import JSONSchema202012KeywordExamplesWrapper from "./json-schema-2020-12-extensions/wrap-components/keywords/Examples"
import JSONSchema202012KeywordPropertiesWrapper from "./json-schema-2020-12-extensions/wrap-components/keywords/Properties"
import afterLoad from "./after-load"

const OAS31Plugin = ({ fn }) => {
  const createSystemSelector = fn.createSystemSelector || createSystemSelectorFn
  const createOnlyOAS31Selector = fn.createOnlyOAS31Selector || createOnlyOAS31SelectorFn // prettier-ignore

  return {
    afterLoad,
    fn: {
      isOAS31: isOAS31Fn,
      createSystemSelector: createSystemSelectorFn,
      createOnlyOAS31Selector: createOnlyOAS31SelectorFn,
    },
    components: {
      Webhooks,
      JsonSchemaDialect,
      MutualTLSAuth,
      OAS31Info: Info,
      OAS31License: License,
      OAS31Contact: Contact,
      OAS31VersionPragmaFilter: VersionPragmaFilter,
      OAS31Model: Model,
      OAS31Models: Models,
      OAS31Auths: Auths,
      JSONSchema202012KeywordExample,
      JSONSchema202012KeywordXml,
      JSONSchema202012KeywordDiscriminator,
      JSONSchema202012KeywordExternalDocs,
      OpenAPI31Extensions: OpenAPIExtensions,
    },
    wrapComponents: {
      InfoContainer: InfoWrapper,
      License: LicenseWrapper,
      Contact: ContactWrapper,
      VersionPragmaFilter: VersionPragmaFilterWrapper,
      Model: ModelWrapper,
      Models: ModelsWrapper,
      AuthItem: AuthItemWrapper,
      auths: AuthsWrapper,
      JSONSchema202012KeywordDescription:
        JSONSchema202012KeywordDescriptionWrapper,
      JSONSchema202012KeywordExamples: JSONSchema202012KeywordExamplesWrapper,
      JSONSchema202012KeywordProperties:
        JSONSchema202012KeywordPropertiesWrapper,
    },
    statePlugins: {
      auth: {
        wrapSelectors: {
          definitionsToAuthorize: definitionsToAuthorizeWrapper,
        },
      },
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
