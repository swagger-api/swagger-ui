import React from "react"
import PropTypes from "prop-types"

let Perf = null
let ReactPerfTool = null
if (process.env.NODE_ENV !== "production") {
  Perf = require("react-addons-perf")
  window.Perf = Perf

  ReactPerfTool = require("react-perf-tool")
  require("react-perf-tool/lib/styles.css")
}

export default class App extends React.Component {

  getLayout() {
    let { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component ? Component : ()=> <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  render() {
    const Layout = this.getLayout()

    return (
      <div>
        <Layout/>
        <ReactPerfTool perf={Perf} />
      </div>
    )
  }
}

App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
}

App.defaultProps = {
}
