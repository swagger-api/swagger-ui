import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

const InfoUrl = ({ url, getComponent }) => {    
  const Link = getComponent("Link")
  
  return (
    <Link target="_blank" href={ sanitizeUrl(url) }>
      <span className="url"> { url } </span>
    </Link>
  )
}

InfoUrl.propTypes = {
  url: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired
}

export default InfoUrl