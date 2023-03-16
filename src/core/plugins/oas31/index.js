/**
 * @prettier
 */
import Webhooks from "./components/webhooks"
import { isOAS31, webhooks } from "./spec-extensions/selectors"
import { isOAS3 } from "./spec-extensions/wrap-selectors"

const OAS31Plugin = () => {
  return {
    components: {
      Webhooks,
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
