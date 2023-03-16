/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import Info from "./components/info"
import LicenseWrapper from "./wrap-components/license"
import InfoWrapper from "./wrap-components/info"
import { isOAS31, webhooks } from "./spec-extensions/selectors"
import { isOAS3 } from "./spec-extensions/wrap-selectors"

const OAS31Plugin = () => {
  return {
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
          webhooks,
        },
        wrapSelectors: {
          isOAS3,
        },
      },
    },
  }
}

export default OAS31Plugin
