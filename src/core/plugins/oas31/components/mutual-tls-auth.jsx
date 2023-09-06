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
        {schema.name} (mutualTLS){" "}
        <JumpToPath path={["securityDefinitions", schema.name]} />
      </h4>
      <p>
        Mutual TLS is required by this API/Operation. Certificates are managed
        via your Operating System and/or your browser.
      </p>
      <p>{schema.description}</p>
    </div>
  )
}

MutualTLSAuth.propTypes = {
  schema: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default MutualTLSAuth
