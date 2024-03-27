/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

class App extends React.Component {
  getLayout() {
    const { getComponent, layoutSelectors } = this.props
    const layoutName = layoutSelectors.current()
    const Component = getComponent(layoutName, true)

    return Component
      ? Component
      : () => <h1> No layout defined for &quot;{layoutName}&quot; </h1>
  }

  render() {
    const Layout = this.getLayout()

    return <Layout />
  }
}

App.propTypes = {
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
}

export default App
