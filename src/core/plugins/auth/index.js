import reducers from "./reducers"
import * as actions from "./actions"
import * as selectors from "./selectors"
import * as specWrapActionReplacements from "./spec-wrap-actions"

export default function() {
  return {
    afterLoad(system) {
      this.rootInjects = this.rootInjects || {}
      this.rootInjects.initOAuth = system.authActions.configureAuth
    },
    statePlugins: {
      auth: {
        reducers,
        actions,
        selectors
      },
      spec: {
        wrapActions: specWrapActionReplacements
      }
    }
  }
}
