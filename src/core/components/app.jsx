import React from "react"
import PropTypes from "prop-types"
import { makeDeeplinks } from "../plugins/deep-linking/helpers.js"


export default class App extends React.Component {

  getLayout() {
    let { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component ? Component : ()=> <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  componentDidMount() {
    document.body.addEventListener("deeplink", function(event) {
      const fragment = event.target.getAttribute("href")
      console.log(fragment)
    })
  }

  render() {
    const Layout = this.getLayout()
    return (
      <Layout/>
    )
  }
}

App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
}

App.defaultProps = {
}
