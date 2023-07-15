/**
 * @prettier
 */
import React from "react"

export function isOAS30(jsSpec) {
  const oasVersion = jsSpec.get("openapi")

  return (
    typeof oasVersion === "string" &&
    /^3\.0\.([0123])(?:-rc[012])?$/.test(oasVersion)
  )
}

export function isSwagger2(jsSpec) {
  const swaggerVersion = jsSpec.get("swagger")

  return typeof swaggerVersion === "string" && swaggerVersion === "2.0"
}

export function OAS3ComponentWrapFactory(Component) {
  return (Ori, system) => (props) => {
    if (typeof system.specSelectors?.isOAS3 === "function") {
      if (system.specSelectors.isOAS3()) {
        return <Component {...props} {...system} Ori={Ori}></Component>
      } else {
        return <Ori {...props}></Ori>
      }
    } else {
      console.warn("OAS3 wrapper: couldn't get spec")
      return null
    }
  }
}

export function OAS30ComponentWrapFactory(Component) {
  return (Ori, system) => (props) => {
    if (typeof system.specSelectors?.isOAS30 === "function") {
      if (system.specSelectors.isOAS30()) {
        return <Component {...props} {...system} Ori={Ori}></Component>
      } else {
        return <Ori {...props}></Ori>
      }
    } else {
      console.warn("OAS30 wrapper: couldn't get spec")
      return null
    }
  }
}
