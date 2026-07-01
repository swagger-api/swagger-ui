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

export const selectAuthPath =
  (state, name) =>
  ({ specSelectors }) =>
    List(
      specSelectors.isOAS3()
        ? ["components", "securitySchemes", name]
        : ["securityDefinitions", name]
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
  let result = List()
  allDefinitions.forEach( (definition) => {
    let security = securities.find(sec => sec.get(definition.keySeq().first()))
    if ( security ) {
      definition.forEach( (props, name) => {
        if ( props.get("type") === "oauth2" ) {
          const securityScopes = security.get(name)
          let definitionScopes = props.get("scopes")
          if( List.isList(securityScopes) && Map.isMap(definitionScopes) ) {
            definitionScopes.keySeq().forEach( (key) => {
              if ( !securityScopes.contains(key) ) {
                definitionScopes = definitionScopes.delete(key)
              }
            })
            definition = definition.set(name, props.set("scopes", definitionScopes))
          }
        }
      })
      result = result.push(definition)
    }
  })
  return result
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

export const getSecurityRequirementsForOperation = (state, securities) => ({ specSelectors }) => {
  if (!securities || !securities.count()) {
    return null
  }

  const securityDefinitions = specSelectors.securityDefinitions() || Map({})
  const requirements = []

  securities.forEach((requirement) => {
    const schemes = []

    requirement.forEach((scopes, schemeName) => {
      const definition = securityDefinitions.get(schemeName)

      if (definition) {
        const schemeInfo = {
          name: schemeName,
          type: definition.get("type"),
          scopes: scopes ? scopes.toJS() : [],
          description: definition.get("description")
        }

        // Add scheme-specific metadata
        if (definition.get("type") === "oauth2") {
          schemeInfo.flow = definition.get("flow")
          schemeInfo.authorizationUrl = definition.get("authorizationUrl")
          schemeInfo.tokenUrl = definition.get("tokenUrl")
        } else if (definition.get("type") === "openIdConnect") {
          schemeInfo.openIdConnectUrl = definition.get("openIdConnectUrl")
        } else if (definition.get("type") === "apiKey") {
          schemeInfo.in = definition.get("in")
          schemeInfo.name = definition.get("name")
        } else if (definition.get("type") === "http") {
          schemeInfo.scheme = definition.get("scheme")
          schemeInfo.bearerFormat = definition.get("bearerFormat")
        }

        schemes.push(schemeInfo)
      }
    })

    if (schemes.length > 0) {
      requirements.push(schemes)
    }
  })

  return requirements
}
