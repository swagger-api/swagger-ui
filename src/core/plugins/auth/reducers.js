import { fromJS, Map } from "immutable"
import { btoa, isFunc } from "core/utils"

import {
  SHOW_AUTH_POPUP,
  AUTHORIZE,
  AUTHORIZE_OAUTH2,
  LOGOUT,
  CONFIGURE_AUTH,
  CONFIGURE_PRESERVATION
} from "./actions"

export default {
  [SHOW_AUTH_POPUP]: (state, { payload } ) =>{
    return state.set( "showDefinitions", payload )
  },

  [AUTHORIZE]: (state, { payload } ) =>{
    let securities = fromJS(payload)
    let map = state.get("authorized") || Map()

    // refactor withMutations
    securities.entrySeq().forEach( ([ key, security ]) => {
      if (!isFunc(security.getIn)) {
        return state.set("authorized", map)
      }
      let type = security.getIn(["schema", "type"])

      if ( type === "apiKey" || type === "http" ) {
        map = map.set(key, security)
      } else if ( type === "basic" ) {
        let username = security.getIn(["value", "username"])
        let password = security.getIn(["value", "password"])

        map = map.setIn([key, "value"], {
          username: username,
          header: "Basic " + btoa(username + ":" + password)
        })

        map = map.setIn([key, "schema"], security.get("schema"))
      }
    })
    
    if(state.get("preserveAuthorization")) {
      localStorage.setItem("authorized", JSON.stringify(map.toJS()))
    }   

    return state.set( "authorized", map )
  },

  [AUTHORIZE_OAUTH2]: (state, { payload } ) =>{
    let { auth, token } = payload
    let parsedAuth

    auth.token = Object.assign({}, token)
    parsedAuth = fromJS(auth)

    let map = state.get("authorized") || Map()
    map = map.setIn(["authorized", parsedAuth.get("name")], parsedAuth)

    if(state.get("preserveAuthorization")) {
      localStorage.setItem("authorized", JSON.stringify(map.toJS()))
    }   

    return state.set( "authorized", map )
  },

  [LOGOUT]: (state, { payload } ) =>{
    let result = state.get("authorized").withMutations((authorized) => {
        payload.forEach((auth) => {
          authorized.delete(auth)
        })
      })

    if(state.get("preserveAuthorization")) {
      localStorage.setItem("authorized", JSON.stringify(result.toJS()))
    }   

    return state.set("authorized", result)
  },

  [CONFIGURE_AUTH]: (state, { payload } ) =>{
    return state.set("configs", payload)
  },

  [CONFIGURE_PRESERVATION]: (state, { payload } ) =>{
    if(payload.preserve && payload.authorized)
    {      
      state = state.set("authorized", fromJS(payload.authorized))
    }
    return state.set("preserveAuthorization", payload.preserve)
  },
}
