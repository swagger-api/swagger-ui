/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

const MutualTLSAuth = ({ schema, getComponent }) => {
  const JumpToPath = getComponent("JumpToPath", true)
  return (
    <div>
      <h4>
        {schema.get("name")} (mutualTLS){" "}
        <JumpToPath path={["securityDefinitions", schema.get("name")]} />
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
}

export default MutualTLSAuth
