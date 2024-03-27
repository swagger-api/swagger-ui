/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { safeBuildUrl } from "core/utils/url"
import { sanitizeUrl } from "core/utils"

class License extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    selectedServer: PropTypes.string,
    url: PropTypes.string.isRequired,
  }

  render() {
    const { license, getComponent, selectedServer, url: specUrl } = this.props
    const name = license.get("name", "License")
    const url = safeBuildUrl(license.get("url"), specUrl, { selectedServer })

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
}

export default License
