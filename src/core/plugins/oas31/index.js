/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import License from "./components/license"
import LicenseWrapper from "./wrap-components/license"
import { isOAS31, webhooks } from "./spec-extensions/selectors"
import { isOAS3 } from "./spec-extensions/wrap-selectors"

const OAS31Plugin = () => {
  return {
    components: {
      Webhooks,
      OAS31License: License,
    },
    wrapComponents: {
      License: LicenseWrapper,
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
