import React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import { Icon, Button } from "components/layout-utils"

const className = "sui-modal"

const Modal = ({mod, title, onDismiss, children}) => {

	return (
		<div className={cx(className, {
				[`${className}--${mod}`] : mod 
			})}
		>
			<div className={`${className}__backdrop`}></div>
			<div className={`${className}__card`}>
				<div className={`${className}__header`}>
					<h3>{title}</h3>
					<Button
						type="button"
						className={`sui-btn-transparent ${className}__close`}
						onClick={ onDismiss }
						unstyled
					>
						<Icon icon="cancel"/>
					</Button>
				</div>
				<div className={`${className}__content`}>
					{children}
				</div>
			</div>
		</div>
	)
}

Modal.propTypes = {
  mod: PropTypes.string,
	title: PropTypes.string.isRequired,
	onDismiss: PropTypes.func,
	children: PropTypes.node.isRequired
}

export default Modal