/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const LockAuthOperation = ({ getComponent, ...props }) => {
    const LockIcon = getComponent("LockIcon")

    return <LockIcon {...props} />
}

LockAuthOperation.propTypes = {
    getComponent: PropTypes.func.isRequired
}

export default LockAuthOperation