/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { sanitizeUrl } from "core/utils/url"

const Info = ({ getComponent, specSelectors }) => {
  const version = specSelectors.version()
  const url = specSelectors.url()
  const basePath = specSelectors.basePath()
  const host = specSelectors.host()
  const summary = specSelectors.selectInfoSummaryField()
  const description = specSelectors.selectInfoDescriptionField()
  const title = specSelectors.selectInfoTitleField()
  const termsOfServiceUrl = specSelectors.selectInfoTermsOfServiceUrl()
  const externalDocsUrl = specSelectors.selectExternalDocsUrl()
  const externalDocsDesc = specSelectors.selectExternalDocsDescriptionField()
  const contact = specSelectors.contact()
  const license = specSelectors.license()

  const Markdown = getComponent("Markdown", true)
  const Link = getComponent("Link")
  const VersionStamp = getComponent("VersionStamp")
  const OpenAPIVersion = getComponent("OpenAPIVersion")
  const InfoUrl = getComponent("InfoUrl")
  const InfoBasePath = getComponent("InfoBasePath")
  const License = getComponent("License", true)
  const Contact = getComponent("Contact", true)
  const JsonSchemaDialect = getComponent("JsonSchemaDialect", true)

  return (
    <div className="info">
      <hgroup className="main">
        <h2 className="title">
          {title}
          <span>
            {version && <VersionStamp version={version} />}
            <OpenAPIVersion oasVersion="3.1" />
          </span>
        </h2>

        {(host || basePath) && <InfoBasePath host={host} basePath={basePath} />}
        {url && <InfoUrl getComponent={getComponent} url={url} />}
      </hgroup>

      {summary && <p className="info__summary">{summary}</p>}

      <div className="info__description description">
        <Markdown source={description} />
      </div>

      {termsOfServiceUrl && (
        <div className="info__tos">
          <Link target="_blank" href={sanitizeUrl(termsOfServiceUrl)}>
            Terms of service
          </Link>
        </div>
      )}

      {contact.size > 0 && <Contact />}

      {license.size > 0 && <License />}

      {externalDocsUrl && (
        <Link
          className="info__extdocs"
          target="_blank"
          href={sanitizeUrl(externalDocsUrl)}
        >
          {externalDocsDesc || externalDocsUrl}
        </Link>
      )}

      <JsonSchemaDialect />
    </div>
  )
}

Info.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    version: PropTypes.func.isRequired,
    url: PropTypes.func.isRequired,
    basePath: PropTypes.func.isRequired,
    host: PropTypes.func.isRequired,
    selectInfoSummaryField: PropTypes.func.isRequired,
    selectInfoDescriptionField: PropTypes.func.isRequired,
    selectInfoTitleField: PropTypes.func.isRequired,
    selectInfoTermsOfServiceUrl: PropTypes.func.isRequired,
    selectExternalDocsUrl: PropTypes.func.isRequired,
    selectExternalDocsDescriptionField: PropTypes.func.isRequired,
    contact: PropTypes.func.isRequired,
    license: PropTypes.func.isRequired,
  }).isRequired,
}

export default Info
