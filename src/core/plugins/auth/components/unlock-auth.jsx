/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const UnlockAuth = ({ getComponent, ...props }) => {
    const UnlockIcon = getComponent("UnlockIcon")

    return <UnlockIcon {...props} />
}

UnlockAuth.propTypes = {
    getComponent: PropTypes.func.isRequired
}

export default UnlockAuth