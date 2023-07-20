/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const LockAuth = ({ getComponent, ...props }) => {
    const LockIcon = getComponent("LockIcon")

    return <LockIcon {...props} />
}

LockAuth.propTypes = {
    getComponent: PropTypes.func.isRequired
}

export default LockAuth