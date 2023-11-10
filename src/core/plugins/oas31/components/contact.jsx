/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { sanitizeUrl } from "core/utils"

const Contact = ({ getComponent, specSelectors }) => {
  const name = specSelectors.selectContactNameField()
  const url = specSelectors.selectContactUrl()
  const email = specSelectors.selectContactEmailField()

  const Link = getComponent("Link")

  return (
    <div className="info__contact">
      {url && (
        <div>
          <Link href={sanitizeUrl(url)} target="_blank">
            {name} - Website
          </Link>
        </div>
      )}
      {email && (
        <Link href={sanitizeUrl(`mailto:${email}`)}>
          {url ? `Send email to ${name}` : `Contact ${name}`}
        </Link>
      )}
    </div>
  )
}

Contact.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    selectContactNameField: PropTypes.func.isRequired,
    selectContactUrl: PropTypes.func.isRequired,
    selectContactEmailField: PropTypes.func.isRequired,
  }).isRequired,
}

export default Contact
