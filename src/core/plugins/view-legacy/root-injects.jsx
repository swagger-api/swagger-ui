/**
 * @prettier
 */
import React from "react"
import ReactDOM from "react-dom"

export const render =
  (getSystem, getStore, getComponent, getComponents) => (domNode) => {
    const App = getComponent(getSystem, getStore, getComponents)("App", "root")

    ReactDOM.render(<App />, domNode)
  }
