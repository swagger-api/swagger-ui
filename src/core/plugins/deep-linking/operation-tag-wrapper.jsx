import React from "react"
import { PropTypes } from "prop-types"

const Wrapper = (Ori, system) => class OperationTagWrapper extends React.Component {

  static propTypes = {
    tag: PropTypes.object.isRequired,
  }

  onLoad = (ref) => {
    const { tag } = this.props
    const isShownKey = ["operations-tag", tag]
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
