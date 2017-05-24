import React from "react"

const SUPPORTED_OPENAPI_VERSIONS = ["3.0.0-rc0"]

export function isOAS3(jsSpec) {
  return !!jsSpec.openapi && SUPPORTED_OPENAPI_VERSIONS.indexOf(jsSpec.openapi) > -1
}

export function OAS3ComponentWrapFactory(Component) {
  return (Ori, system) => (props) => {
    if(system && system.specSelectors && system.specSelectors.specJson) {
      const spec = system.specSelectors.specJson().toJS()

      if(isOAS3(spec)) {
        return <Component {...props}></Component>
      } else {
        return <Ori {...props}></Ori>
      }
    } else {
      console.warn("OAS3 wrapper: couldn't get spec")
      return null
    }
  }
}
