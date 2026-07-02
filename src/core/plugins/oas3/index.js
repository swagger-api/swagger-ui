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
import { makeIsFileUploadIntended } from "./fn"
import afterLoad from "./after-load"

export default function ({ getSystem }) {
  const isFileUploadIntended = makeIsFileUploadIntended(getSystem)

  return {
    afterLoad,
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
        actions: { ...actions },
        reducers,
        selectors: { ...selectors },
      },
    },
    fn: {
      isFileUploadIntended,
      isFileUploadIntendedOAS30: isFileUploadIntended,
    },
  }
}
