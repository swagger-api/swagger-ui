/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import omit from "lodash/omit"

class LockAuthIcon extends React.Component {
  mapStateToProps(state, props) {
    const ownProps = omit(props, Object.keys(props.getSystem()))
    return { state, ownProps }
  }

  render() {
    const { getComponent, ownProps } = this.props
    const LockIcon = getComponent("LockIcon")

    return <LockIcon {...ownProps} />
  }
}

LockAuthIcon.propTypes = {
  getComponent: PropTypes.func.isRequired,
  ownProps: PropTypes.shape({}).isRequired,
}

export default LockAuthIcon
