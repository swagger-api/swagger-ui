import React from "react"
import PropTypes from "prop-types"

export default class App extends React.Component {

  getLayout() {
    let { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)
    return Component ? Component : ()=> <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  componentDidMount() {
    const sys = this.props
    const { onDeepLinkClicked } = sys.fn

    onDeepLinkClicked(sys, function(...args) {
      const [path, show, scrollTo] = args
      show(path)
      scrollTo(path)
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
