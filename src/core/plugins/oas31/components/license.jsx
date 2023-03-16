/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { sanitizeUrl } from "core/utils"

const License = ({ getComponent, specSelectors }) => {
  const name = specSelectors.selectLicenseNameField()
  const url = specSelectors.selectLicenseUrl()

  const Link = getComponent("Link")

  return (
    <div className="info__license">
      {url ? (
        <div className="info__license__url">
          <Link target="_blank" href={sanitizeUrl(url)}>
            {name}
          </Link>
        </div>
      ) : (
        <span>{name}</span>
      )}
    </div>
  )
}

License.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    selectLicenseNameField: PropTypes.func.isRequired,
    selectLicenseUrl: PropTypes.func.isRequired,
  }).isRequired,
}

export default License
