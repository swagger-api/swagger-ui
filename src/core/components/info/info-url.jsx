import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

export default class InfoUrl extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  
  render() {
    const { url, getComponent } = this.props

    const Link = getComponent("Link")

    return (<Link target="_blank" href={ sanitizeUrl(url) }><span className="url"> { url } </span></Link>)
  }
}