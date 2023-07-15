/**
 * @prettier
 */
import * as specWrapSelectors from "./spec-extensions/wrap-selectors"
import * as authWrapSelectors from "./auth-extensions/wrap-selectors"
import * as specSelectors from "./spec-extensions/selectors"
import components from "./components"
import wrapComponents from "./wrap-components"
import * as actions from "./actions"
import * as selectors from "./selectors"
import reducers from "./reducers"

export default function () {
  return {
    components,
    wrapComponents,
    statePlugins: {
      spec: {
        wrapSelectors: specWrapSelectors,
        selectors: specSelectors,
      },
      auth: {
        wrapSelectors: authWrapSelectors,
      },
      oas3: {
        actions,
        reducers,
        selectors,
      },
    },
  }
}
