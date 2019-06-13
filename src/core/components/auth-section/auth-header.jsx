import React from "react"
import PropTypes from "prop-types"

const AuthHeader = ({children}) => {
	return (
		<div className="auth__header">
			<h4>{children}</h4>
		</div>
	)
}

AuthHeader.propTypes = {
  children: PropTypes.node
}

export default AuthHeader