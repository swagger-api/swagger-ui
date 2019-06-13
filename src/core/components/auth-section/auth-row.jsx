import React from "react"
import PropTypes from "prop-types"

const AuthRow = ({children}) => {
	
	return (
		<div className="auth__row">
			{children}
		</div>
	)
}

AuthRow.propTypes = {
  children: PropTypes.node
}

export default AuthRow