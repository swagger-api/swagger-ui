import React from "react"
import { PropTypes } from "prop-types"

const Wrapper = (Ori, system) => class ModelContainerWrapper extends React.Component {

  static propTypes = {
    name: PropTypes.object.isRequired,
  }

  onLoad = (ref) => {
    const { name } = this.props
    const isShownKey = ["models", name]
    system.layoutActions.readyToScroll(isShownKey, ref)
  }

  render() {
    return (
      <div ref={this.onLoad}>
        <Ori {...this.props} />
      </div>
    )
  }
}

export default Wrapper
