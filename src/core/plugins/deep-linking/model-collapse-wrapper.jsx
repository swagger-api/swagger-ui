import React from "react"
import { PropTypes } from "prop-types"

const Wrapper = (Ori, system) => class ModelCollapseWrapper extends React.Component {

  static propTypes = {
    modelName: PropTypes.object.isRequired,
  }

  onLoad = (ref) => {
    const { modelName } = this.props
    const isShownKey = ["models", modelName]
    system.layoutActions.readyToScroll(isShownKey, ref)
  }

  render() {
    return (
      <span ref={this.onLoad}>
        <Ori {...this.props} />
      </span>
    )
  }
}

export default Wrapper
