/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Info from "./components/info"
import LicenseWrapper from "./wrap-components/license"
import InfoWrapper from "./wrap-components/info"
import { isOAS31, license, webhooks } from "./spec-extensions/selectors"
import { isOAS3 } from "./spec-extensions/wrap-selectors"
import {
  makeSelectLicenseUrl,
  selectLicenseIdentifierField,
  selectLicenseNameField,
  selectLicenseUrlField,
} from "./selectors"

const OAS31Plugin = () => {
  return {
    afterLoad(system) {
      const oas31Selectors = this.statePlugins.oas31.selectors

      oas31Selectors.selectLicenseUrl = makeSelectLicenseUrl(system)
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
          isOAS31,
          license,
          webhooks,
        },
        wrapSelectors: {
          isOAS3,
        },
      },
      oas31: {
        selectors: {
          selectLicenseNameField,
          selectLicenseUrlField,
          selectLicenseIdentifierField,
        },
      },
    },
  }
}

export default OAS31Plugin
