import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class ScopeDisplay extends React.Component {
  static propTypes = {
    security: ImPropTypes.iterable,
    authSelectors: PropTypes.object.isRequired,
    authDefinitions: ImPropTypes.iterable,
    specSelectors: PropTypes.object.isRequired
  }

  extractSecurityRequirements = (security) => {
    if (!security || !security.count()) {
      return null
    }

    const requirements = []

    // Each item in security array represents an OR condition
    security.forEach((requirement) => {
      const schemes = []

      // Each entry in a requirement represents an AND condition
      requirement.forEach((scopes, schemeName) => {
        const schemeData = {
          name: schemeName,
          scopes: []
        }

        // Handle different security scheme types
        if (scopes && scopes.size > 0) {
          // For OAuth2, OpenID Connect, or any scheme with scopes
          schemeData.scopes = scopes.toJS()
        }

        schemes.push(schemeData)
      })

      requirements.push(schemes)
    })

    return requirements
  }

  formatNonOptionalRequirements = (requirements) => {
    return requirements.map((requirementGroup, idx) => {
      const isLastGroup = idx === requirements.length - 1

      return (
        <span key={idx} className="opblock-security-requirement-group">
          {requirementGroup.map((scheme, schemeIdx) => {
            const isLastInGroup = schemeIdx === requirementGroup.length - 1

            return (
              <span key={schemeIdx} className="opblock-security-requirement">
                <span className="opblock-security-scheme-name">{scheme.name}</span>
                {scheme.scopes.length > 0 && (
                  <span className="opblock-security-scope-list">
                    {" ("}
                    {scheme.scopes.map((scope, scopeIdx) => (
                      <React.Fragment key={scopeIdx}>
                        <code className="opblock-security-scope">
                          {scope}
                        </code>
                        {scopeIdx < scheme.scopes.length - 1 ? ", " : ""}
                      </React.Fragment>
                    ))}
                    {")"}
                  </span>
                )}
                {!isLastInGroup && (
                  <span className="opblock-security-operator"> + </span>
                )}
              </span>
            )
          })}
          {!isLastGroup && (
            <span className="opblock-security-operator"> OR </span>
          )}
        </span>
      )
    })
  }

  formatSecurityDisplay = (requirements) => {
    if (!requirements || requirements.length === 0) {
      return null
    }

    // Check if this is optional security (empty object in array)
    if (requirements.length === 1 && requirements[0].length === 0) {
      return <span className="opblock-security-requirement opblock-security-optional">Optional</span>
    }

    // Check for optional security pattern (one empty and others with auth)
    const hasEmptyRequirement = requirements.some(req => req.length === 0)
    const hasNonEmptyRequirement = requirements.some(req => req.length > 0)

    if (hasEmptyRequirement && hasNonEmptyRequirement) {
      // Filter out empty requirements and add optional label
      const nonEmptyRequirements = requirements.filter(req => req.length > 0)
      return (
        <React.Fragment>
          <span className="opblock-security-requirement opblock-security-optional">Optional</span>
          <span className="opblock-security-operator"> OR </span>
          {this.formatNonOptionalRequirements(nonEmptyRequirements)}
        </React.Fragment>
      )
    }

    return this.formatNonOptionalRequirements(requirements)
  }

  render() {
    const { security } = this.props
    const requirements = this.extractSecurityRequirements(security)
    const display = this.formatSecurityDisplay(requirements)

    if (!display) {
      return null
    }

    return (
      <div className="opblock-security-display">
        {display}
      </div>
    )
  }
}