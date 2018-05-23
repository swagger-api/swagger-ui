import React from "react"
import PropTypes from "prop-types"
import { makeDeeplinks } from "../plugins/deep-linking/helpers.js"
import focus from "../plugins/deep-linking/focus.js"



export default class App extends React.Component {

  getLayout() {
    let { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component ? Component : ()=> <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  componentDidMount() {
    makeDeeplinks(document.body)
    //Focus on a deeplink's target whenever a deeplink is clicked
    document.body.addEventListener("deeplinkClick", function() {
      focus(this.props.layoutActions, this.props.getConfigs)
    }.bind(this))
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
  layoutActions: PropTypes.object.isRequired,
  getConfigs: PropTypes.func.isRequired
}

App.defaultProps = {
}
