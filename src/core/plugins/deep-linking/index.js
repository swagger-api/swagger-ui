import layout from "./layout"
import OperationWrapper from "./operation-wrapper"
import OperationTagWrapper from "./operation-tag-wrapper"

export default function() {
  return [layout, {
    statePlugins: {
      configs: {
        wrapActions: {
          loaded: (ori, system) => (...args) => {
            ori(...args)
            const hash = window.location.hash
            system.layoutActions.parseDeepLinkHash(hash)
          }
        }
      }
    },
    wrapComponents: {
      operation: OperationWrapper,
      OperationTag: OperationTagWrapper,
    },
  }]
}
