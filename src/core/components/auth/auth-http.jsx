import React from "react"
import PropTypes from "prop-types"

const AuthHttp = ({ schema, getComponent, name, onChange, isAuthorized, authorizedUsername }) => {
  
  const AuthHttpBasic = getComponent("authHttpBasic")
  const AuthHttpBearer = getComponent("authHttpBearer")

  const scheme = (schema.get("scheme") || "").toLowerCase()
  

  if(scheme === "basic") {
    return (
      <AuthHttpBasic
        getComponent={getComponent}
        name={name}
        schema={schema}
        onChange={onChange}
        isAuthorized={isAuthorized}
        authorizedUsername={authorizedUsername}
      />
    )
  }

  if(scheme === "bearer") {
    return (
      <AuthHttpBearer
        getComponent={getComponent}
        name={name}
        schema={schema}
        onChange={onChange}
        isAuthorized={isAuthorized}
      />
    )
  }

  return (
    <div>
      <em><b>{name}</b> HTTP authentication: unsupported scheme {`'${scheme}'`}</em>
    </div>
    )

}

AuthHttp.propTypes = {
  isAuthorized: PropTypes.bool.isRequired,
  authorizedUsername: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func
}

export default AuthHttp