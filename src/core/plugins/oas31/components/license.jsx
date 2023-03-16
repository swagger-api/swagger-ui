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
    selectedServer: PropTypes.string,
    url: PropTypes.string.isRequired,
  }

  render() {
    const { license, getComponent, selectedServer, url: specUrl } = this.props
    const name = license.get("name", "License")
    const url = sanitizeUrl(
      safeBuildUrl(license.get("url"), specUrl, { selectedServer })
    )
    const identifier = license.get("identifier", "")
    const spdxURL = sanitizeUrl(`https://spdx.org/licenses/${identifier}.html`)

    const Link = getComponent("Link")

    return (
      <div className="info__license">
        {identifier && (
          <div className="info__license__url">
            <Link target="_blank" href={spdxURL}>
              <span className="info__license__url">{name}</span>
            </Link>
          </div>
        )}

        {url && !identifier && (
          <div className="info__license__url">
            <Link target="_blank" href={url}>
              {name}
            </Link>
          </div>
        )}

        {!url && !identifier && <span>{name}</span>}
      </div>
    )
  }
}

export default License
