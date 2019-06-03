import React from "react"
import PropTypes from "prop-types"

export default class SchemesContainer extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
  }

  render () {
    const {specActions, specSelectors, getComponent, translate} = this.props

    const currentScheme = specSelectors.operationScheme()
    const schemes = specSelectors.schemes()

    const Schemes = getComponent("schemes")

    const schemesArePresent = schemes && schemes.size

    return schemesArePresent ? (
        <Schemes
          currentScheme={currentScheme}
          schemes={schemes}
          specActions={specActions}
          title={translate("schemes.schemes")}
        />
      ) : null
  }
}
