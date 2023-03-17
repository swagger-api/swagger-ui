/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Contact from "./components/contact"
import Info from "./components/info"
import LicenseWrapper from "./wrap-components/license"
import ContactWrapper from "./wrap-components/contact"
import InfoWrapper from "./wrap-components/info"
import {
  license,
  contact,
  webhooks,
  selectLicenseNameField,
  selectLicenseUrlField,
  selectLicenseIdentifierField,
  selectContactNameField,
  selectContactEmailField,
  selectContactUrlField,
  makeSelectContactUrl,
  makeIsOAS31,
  makeSelectLicenseUrl,
} from "./spec-extensions/selectors"
import {
  isOAS3 as isOAS3Wrapper,
  selectLicenseUrl as selectLicenseUrlWrapper,
} from "./spec-extensions/wrap-selectors"
import { makeSelectLicenseUrl as makeOAS31SelectLicenseUrl } from "./selectors"

const OAS31Plugin = () => {
  return {
    afterLoad(system) {
      const oas31Selectors = this.statePlugins.oas31.selectors
      const specSelectors = this.statePlugins.spec.selectors

      specSelectors.isOAS31 = makeIsOAS31(system)
      specSelectors.selectLicenseUrl = makeSelectLicenseUrl(system)
      specSelectors.selectContactUrl = makeSelectContactUrl(system)

      oas31Selectors.selectLicenseUrl = makeOAS31SelectLicenseUrl(system)
    },
    components: {
      Webhooks,
      OAS31Info: Info,
      OAS31License: License,
      OAS31Contact: Contact,
    },
    wrapComponents: {
      info: InfoWrapper,
      License: LicenseWrapper,
      Contact: ContactWrapper,
    },
    statePlugins: {
      spec: {
        selectors: {
          license,
          selectLicenseNameField,
          selectLicenseUrlField,
          selectLicenseIdentifierField,
          contact,
          selectContactNameField,
          selectContactEmailField,
          selectContactUrlField,
          webhooks,
        },
        wrapSelectors: {
          isOAS3: isOAS3Wrapper,
          selectLicenseUrl: selectLicenseUrlWrapper,
        },
      },
      oas31: {
        selectors: {},
      },
    },
  }
}

export default OAS31Plugin
