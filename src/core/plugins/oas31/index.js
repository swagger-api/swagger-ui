/**
 * @prettier
 */
import { isOAS31, webhooks } from "./spec-extensions/selectors"
import { isOAS3 } from "./spec-extensions/wrap-selectors"

const OAS31Plugin = () => {
  return {
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
