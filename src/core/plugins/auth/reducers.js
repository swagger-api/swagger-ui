import { fromJS, Map } from "immutable"
import { btoa } from "core/utils"

import {
  SHOW_AUTH_POPUP,
  RECEIVE_OTP,
  AUTHORIZE,
  AUTHORIZE_OAUTH2,
  LOGOUT,
  CONFIGURE_AUTH
} from "./actions"

export default {
  [SHOW_AUTH_POPUP]: (state, { payload } ) =>{
    return state.set( "showDefinitions", payload )
  },

  [RECEIVE_OTP]: (state, { payload } ) =>{
    return state.setIn( [ "authorized", "otpSent" ], payload )
  },

  [AUTHORIZE]: (state, { payload } ) =>{
    let securities = fromJS(payload)
    let map = state.get("authorized") || Map()

    // refactor withMutations
    securities.entrySeq().forEach( ([ key, security ]) => {
      let type = security.getIn(["schema", "type"])
      let tokenUrl = security.getIn(["schema", "tokenUrl"])

      if ( type === "apiKey") {
        if(!tokenUrl) {
          map = map.set(key, security)
        } else {
          let name = security.get("name")
          map = map.setIn([name, "name"], name)

          let apiSchema = {
            'type' : 'apiKey',
            'in' : 'header',
            'name' : 'Authorization'
          }
          map = map.setIn([name, "schema"], fromJS(apiSchema))

          let value = 'Bearer ' + security.get("token")
          map = map.setIn([name, "value"], value)

          let username = security.get("username")
          map = map.setIn([name, "username"], username)

          let email = security.get("email")
          map = map.setIn([name, "email"], email)
        }
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

    return state.set( "authorized", map )
  },

  [AUTHORIZE_OAUTH2]: (state, { payload } ) =>{
    let { auth, token } = payload
    let parsedAuth

    auth.token = token
    parsedAuth = fromJS(auth)

    return state.setIn( [ "authorized", parsedAuth.get("name") ], parsedAuth )
  },

  [LOGOUT]: (state, { payload } ) =>{
    let result = state.get("authorized").withMutations((authorized) => {
        payload.forEach((auth) => {
          authorized.delete(auth)
        })
      })

    return state.set("authorized", result)
  },

  [CONFIGURE_AUTH]: (state, { payload } ) =>{
    return state.set("configs", payload)
  }
}
