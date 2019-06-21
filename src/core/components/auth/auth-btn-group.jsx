import React from "react"
import PropTypes from "prop-types"

const AuthBtnGroup = ({ getComponent, authorized, inValid, logoutClick, authorizeClick, closeClick }) => {
	const Button = getComponent("Button")

	return (
		<div className="auth-btn-wrapper sui-btn-wrapper">
			{ !inValid && (
					authorized
						? <Button className="modal-btn" mod="tertiary-lt" onClick={ logoutClick } >
								<span>Logout</span>
							</Button>
						: <Button className="modal-btn" mod="primary" onClick={ authorizeClick }>
								<span>Authorize</span>
							</Button>
				)
			}
			<Button className="modal-btn" mod="secondary" onClick={ closeClick }>
				<span>Close</span>
			</Button>
		</div>
	)
}

AuthBtnGroup.propTypes = {
	getComponent: PropTypes.func.isRequired,
	authorized: PropTypes.bool.isRequired,
	inValid: PropTypes.bool,
	logoutClick: PropTypes.func.isRequired,
	authorizeClick: PropTypes.func,
	closeClick: PropTypes.func.isRequired,
}

export default AuthBtnGroup