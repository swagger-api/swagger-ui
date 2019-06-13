import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

const AuthFormRow = ({label, htmlFor, mod, children}) => {

	return (
		<div className={cx("auth__row--form", {
				[`auth__row--${mod}`] : mod 
			})}
		>
				<label htmlFor={htmlFor}>
					<span>{label}</span>
				</label>
				<span>{children}</span>
		</div>
	)
}

AuthFormRow.propTypes = {
	label: PropTypes.string,
	htmlFor: PropTypes.string,
	mod: PropTypes.string,
  children: PropTypes.node
}

export default AuthFormRow