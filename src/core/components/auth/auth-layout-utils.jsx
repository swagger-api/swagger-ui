import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

export const AuthHeader = ({children}) => {
	return (
		<div className="auth__header">
			<h4>{children}</h4>
		</div>
	)
}

AuthHeader.propTypes = {
  children: PropTypes.node
}

export const AuthRow = ({children}) => {
	
	return (
		<div className="auth__row">
			{children}
		</div>
	)
}

AuthRow.propTypes = {
  children: PropTypes.node
}

export const AuthFormRow = ({label, htmlFor, mod, children}) => {

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