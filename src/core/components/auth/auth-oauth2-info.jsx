import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const AuthOauth2Info = ({ getComponent, name, schema, appName, isAuthorized, showAuthURL, showTokenURL }) => {
	const Markdown = getComponent( "Markdown" )
	const JumpToPath = getComponent("JumpToPath", true)

	const description = schema.get("description")
	const authorizationUrl = schema.get("authorizationUrl")
	const tokenUrl = schema.get("tokenUrl")
	const flow = schema.get("flow")

	return (
		<div>
			<div className="auth__description">
				<div>
					<p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.</p>
				</div>
				<div>
					<p>API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>
				</div>
			</div>
          
			<div className="auth__header">
				<h4>
					{ name } (OAuth2, { flow }) <JumpToPath path={[ "securityDefinitions", name ]} />
				</h4>
			</div>

			{ appName
				? <div className="auth__row">
						<h5>Application: { appName } </h5>
					</div> 
				: null
			}

			{ description && <div className="auth__row">
					<Markdown source={ description } />
				</div> 
			}

			{ isAuthorized && <div className="auth__row">
					<h6>Authorized</h6>
				</div> }

			{ showAuthURL && <div className="auth__row">
				<p>Authorization URL: <code>{ authorizationUrl }</code></p>
				</div>
			}

			{ showTokenURL && <div className="auth__row">
					<p>Token URL: <code> { tokenUrl }</code></p>
				</div>
			}

			<div className="auth__row"> 
				<p className="flow">Flow: <code>{ flow }</code></p>
			</div>
		</div>
	)
}

AuthOauth2Info.propTypes = {
	getComponent: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	schema: ImPropTypes.map.isRequired,
	appName: PropTypes.string,
	isAuthorized: PropTypes.bool.isRequired,
	showAuthURL: PropTypes.bool.isRequired,
	showTokenURL: PropTypes.bool.isRequired
}

export default AuthOauth2Info