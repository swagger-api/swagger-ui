import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

export class TermsOfService extends React.Component {
  static propTypes = {
    termsOfService: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const { termsOfService, getComponent } = this.props
    const Link = getComponent("Link")
    
    return (
      <div className="info__tos">
        <Link target="_blank" href={ sanitizeUrl(termsOfService) }>Terms of service</Link>
      </div>
    )
  }
}