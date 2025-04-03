/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const MutualTLSAuth = ({ schema, getComponent, name, authSelectors }) => {
  const JumpToPath = getComponent("JumpToPath", true)
  const path = authSelectors.selectAuthPath(name)

  return (
    <div>
      <h4>
        {name} (mutualTLS) <JumpToPath path={path} />
      </h4>
      <p>
        Mutual TLS is required by this API/Operation. Certificates are managed
        via your Operating System and/or your browser.
      </p>
      <p>{schema.get("description")}</p>
    </div>
  )
}

MutualTLSAuth.propTypes = {
  schema: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  authSelectors: PropTypes.object.isRequired,
}

export default MutualTLSAuth
