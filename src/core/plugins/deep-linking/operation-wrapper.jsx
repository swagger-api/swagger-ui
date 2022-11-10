import React from "react"
import ImPropTypes from "react-immutable-proptypes"

const Wrapper = (Ori, system) => class OperationWrapper extends React.Component {

  static propTypes = {
    operation: ImPropTypes.map.isRequired,
  }

  onLoad = (ref) => {
    const { operation } = this.props
    const { tag, operationId } = operation.toObject()
    let { isShownKey } = operation.toObject()
    isShownKey = isShownKey || ["operations", tag, operationId]
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
