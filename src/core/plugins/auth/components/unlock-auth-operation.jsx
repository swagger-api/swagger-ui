/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const UnlockAuthOperation = ({ getComponent, ...props }) => {
    const UnlockIcon = getComponent("UnlockIcon")

    return <UnlockIcon {...props} />
}

UnlockAuthOperation.propTypes = {
    getComponent: PropTypes.func.isRequired
}

export default UnlockAuthOperation