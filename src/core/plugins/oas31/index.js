/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Info from "./components/info"
import LicenseWrapper from "./wrap-components/license"
import InfoWrapper from "./wrap-components/info"
import {
  license,
  webhooks,
  selectLicenseNameField,
  selectLicenseUrlField,
  selectLicenseIdentifierField,
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

      specSelectors.selectLicenseUrl = makeSelectLicenseUrl(system)
      specSelectors.isOAS31 = makeIsOAS31(system)
      oas31Selectors.selectLicenseUrl = makeOAS31SelectLicenseUrl(system)
    },
    components: {
      Webhooks,
      OAS31Info: Info,
      OAS31License: License,
    },
    wrapComponents: {
      License: LicenseWrapper,
      info: InfoWrapper,
    },
    statePlugins: {
      spec: {
        selectors: {
          license,
          selectLicenseNameField,
          selectLicenseUrlField,
          selectLicenseIdentifierField,
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
