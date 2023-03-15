/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { sanitizeUrl } from "core/utils"
import { safeBuildUrl } from "core/utils/url"
import { OAS3ComponentWrapFactory } from "../helpers"

const Info = (props) => {
  const {
    info,
    url,
    host,
    basePath,
    getComponent,
    specSelectors,
    externalDocs,
    selectedServer,
    url: specUrl,
  } = props
  const isOAS31 = specSelectors.isOAS31()
  const version = info.get("version")
  const description = info.get("description")
  const title = info.get("title")
  const termsOfServiceUrl = safeBuildUrl(info.get("termsOfService"), specUrl, {
    selectedServer,
  })
  const contact = info.get("contact")
  const license = info.get("license")
  // note that ux may want to move summary to a sub-heading, as summary is a string that does not need to be Markdown
  const summary = info.get("summary") // OAS3.1 field
  const rawExternalDocsUrl = externalDocs && externalDocs.get("url")
  const externalDocsUrl = safeBuildUrl(rawExternalDocsUrl, specUrl, {
    selectedServer,
  })
  const externalDocsDescription =
    externalDocs && externalDocs.get("description")

  const Markdown = getComponent("Markdown", true)
  const Link = getComponent("Link")
  const VersionStamp = getComponent("VersionStamp")
  const InfoUrl = getComponent("InfoUrl")
  const InfoBasePath = getComponent("InfoBasePath")
  const License = getComponent("License")
  const Contact = getComponent("Contact")

  return (
    <div className="info">
      <hgroup className="main">
        <h2 className="title">
          {title}
          {version && <VersionStamp version={version}></VersionStamp>}
        </h2>
        {host || basePath ? (
          <InfoBasePath host={host} basePath={basePath} />
        ) : null}
        {url && <InfoUrl getComponent={getComponent} url={url} />}
      </hgroup>

      {isOAS31 && summary && (
        <div className="info__summary">
          <Markdown source={summary} />
        </div>
      )}
      <div className="description">
        <Markdown source={description} />
      </div>

      {termsOfServiceUrl && (
        <div className="info__tos">
          <Link target="_blank" href={sanitizeUrl(termsOfServiceUrl)}>
            Terms of service
          </Link>
        </div>
      )}

      {contact && contact.size ? (
        <Contact
          getComponent={getComponent}
          data={contact}
          selectedServer={selectedServer}
          url={url}
        />
      ) : null}
      {license && license.size ? (
        <License
          getComponent={getComponent}
          license={license}
          selectedServer={selectedServer}
          url={url}
        />
      ) : null}
      {externalDocsUrl ? (
        <Link
          className="info__extdocs"
          target="_blank"
          href={sanitizeUrl(externalDocsUrl)}
        >
          {externalDocsDescription || externalDocsUrl}
        </Link>
      ) : null}
    </div>
  )
}

Info.propTypes = {
  info: PropTypes.object,
  url: PropTypes.string,
  host: PropTypes.string,
  basePath: PropTypes.string,
  externalDocs: ImPropTypes.map,
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.object.isRequired,
  oas3selectors: PropTypes.func,
  selectedServer: PropTypes.string,
}

export default OAS3ComponentWrapFactory(Info)
