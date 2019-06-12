import React from "react"
import PropTypes from "prop-types"
import { sanitizeUrl } from "core/utils"

const ExternalDocsDesc = ({ externalDocs, getComponent }) => {
  const Markdown = getComponent("Markdown")
  const Link = getComponent("Link")

  return (
    <div className="opblock-external-docs-wrapper">
      <h4 className="opblock-title_normal">Find more details</h4>
      <div className="opblock-external-docs">
        <span className="opblock-external-docs__description">
          <Markdown source={ externalDocs.description } />
        </span>
        <Link
          target="_blank"
          className="opblock-external-docs__link"
          href={sanitizeUrl(externalDocs.url)}
        >
          {externalDocs.url}
        </Link>
      </div>
    </div>
  )
}

ExternalDocsDesc.propTypes = {
  getComponent: PropTypes.func.isRequired,
  externalDocs: PropTypes.object.isRequired
}

export default ExternalDocsDesc