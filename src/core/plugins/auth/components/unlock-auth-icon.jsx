/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import omit from "lodash/omit"

class UnlockAuthIcon extends React.Component {
  mapStateToProps(state, props) {
    const ownProps = omit(props, Object.keys(props.getSystem()))
    return { state, ownProps }
  }

  render() {
    const { getComponent, ownProps } = this.props
    const UnlockIcon = getComponent("UnlockIcon")

    return <UnlockIcon {...ownProps} />
  }
}

UnlockAuthIcon.propTypes = {
  getComponent: PropTypes.func.isRequired,
  ownProps: PropTypes.shape({}).isRequired,
}

export default UnlockAuthIcon
