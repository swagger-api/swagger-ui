import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

export default class License extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    getComponent: PropTypes.func.isRequired

  }

  render(){
    const { license, getComponent } = this.props
    const name = license.get("name") || "License"
    const url = license.get("url")
    const Link = getComponent("Link")

    return (
      <div className="info__license">
        {
          url ? <Link target="_blank" href={ sanitizeUrl(url) }>{ name }</Link>
        : <span>{ name }</span>
        }
      </div>
    )
  }
}