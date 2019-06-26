import { fromJS, Map } from "immutable"
import { btoa } from "core/utils"

import {
  SHOW_AUTH_POPUP,
  AUTHORIZE,
  AUTHORIZE_OAUTH2,
  LOGOUT,
  CONFIGURE_AUTH
} from "./actions"

export default {
  [SHOW_AUTH_POPUP]: (state, { payload } ) =>{
    return state.set( "showDefinitions", payload )
  },

  [AUTHORIZE]: (state, { payload }) => {
    let parsedAuth = fromJS(payload)
    let type = parsedAuth.getIn(["schema", "type"])

    if (type === "basic") {
      let username = parsedAuth.getIn(["value", "username"])
      let password = parsedAuth.getIn(["value", "password"])

      parsedAuth = parsedAuth.setIn("value", Map({
        username,
        "header": "Basic " + btoa(username + ":" + password)
      }))
    }

    return state.setIn(["authorized", parsedAuth.get("name")], parsedAuth)
  },

  [AUTHORIZE_OAUTH2]: (state, { payload } ) =>{
    let { auth, token } = payload
    let parsedAuth

    auth.token = Object.assign({}, token)
    parsedAuth = fromJS(auth)

    return state.setIn( [ "authorized", parsedAuth.get("name") ], parsedAuth )
  },

  [LOGOUT]: (state, { payload }) => {
    const result = state.get("authorized").delete(payload)

    return state.set("authorized", result)
  },

  [CONFIGURE_AUTH]: (state, { payload } ) =>{
    return state.set("configs", payload)
  }
}
