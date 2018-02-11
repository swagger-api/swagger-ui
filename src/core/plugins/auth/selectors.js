import { createSelector } from "reselect"
import { List, Map } from "immutable"

const state = state => state

export const shownDefinitions = createSelector(
    state,
    auth => auth.get( "showDefinitions" )
)

export const definitionsToAuthorize = createSelector(
    state,
    () => ( { specSelectors } ) => {
      let definitions = specSelectors.securityDefinitions() || Map({})
      let list = List()

      //todo refactor
      definitions.entrySeq().forEach( ([ key, val ]) => {
        let map = Map()

        map = map.set(key, val)
        list = list.push(map)
      })

      return list
    }
)


export const getDefinitionsByNames = ( state, securities ) => ( { specSelectors } ) => {
  console.warn("WARNING: getDefinitionsByNames is deprecated and will be removed in the next major version.")
  let securityDefinitions = specSelectors.securityDefinitions()
  let result = List()

  securities.valueSeq().forEach( (names) => {
    let map = Map()
    names.entrySeq().forEach( ([name, scopes]) => {
      let definition = securityDefinitions.get(name)
      let allowedScopes

      if ( definition.get("type") === "oauth2" && scopes.size ) {
        allowedScopes = definition.get("scopes")

        allowedScopes.keySeq().forEach( (key) => {
          if ( !scopes.contains(key) ) {
            allowedScopes = allowedScopes.delete(key)
          }
        })

        definition = definition.set("allowedScopes", allowedScopes)
      }

      map = map.set(name, definition)
    })

    result = result.push(map)
  })

  return result
}

export const definitionsForRequirements = (state, securities = List()) => ({ authSelectors }) => {
  const allDefinitions = authSelectors.definitionsToAuthorize() || List()
  return allDefinitions.filter((def) => {
    return securities.some(sec => sec.get(def.keySeq().first()))
  })
}

export const authorized = createSelector(
    state,
    auth => auth.get("authorized") || Map()
)


export const isAuthorized = ( state, securities ) => ( { authSelectors } ) => {
  let authorized = authSelectors.authorized()

  if(!List.isList(securities)) {
    return null
  }

  return !!securities.toJS().filter( ( security ) => {
      let isAuthorized = true

      return Object.keys(security).map((key) => {
        return !isAuthorized || !!authorized.get(key)
      }).indexOf(false) === -1
    }).length
}

export const getConfigs = createSelector(
    state,
    auth => auth.get( "configs" )
)
