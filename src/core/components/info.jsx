/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { safeBuildUrl, sanitizeUrl } from "core/utils/url"

export class InfoBasePath extends React.Component {
  static propTypes = {
    host: PropTypes.string,
    basePath: PropTypes.string,
  }

  render() {
    const { host, basePath } = this.props

    return (
      <pre className="base-url">
        [ Base URL: {host}
        {basePath} ]
      </pre>
    )
  }
}

export class InfoUrl extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render() {
    const { url, getComponent } = this.props
    const Link = getComponent("Link")

    return (
      <Link target="_blank" href={sanitizeUrl(url)}>
        <span className="url"> {url}</span>
      </Link>
    )
  }
}

class Info extends React.Component {
  static propTypes = {
    title: PropTypes.any,
    description: PropTypes.any,
    version: PropTypes.any,
    info: PropTypes.object,
    url: PropTypes.string,
    host: PropTypes.string,
    basePath: PropTypes.string,
    externalDocs: ImPropTypes.map,
    getComponent: PropTypes.func.isRequired,
    oas3selectors: PropTypes.func,
    selectedServer: PropTypes.string,
  }

  render() {
    const {
      info,
      url,
      host,
      basePath,
      getComponent,
      externalDocs,
      selectedServer,
      url: specUrl,
    } = this.props
    const version = info.get("version")
    const description = info.get("description")
    const title = info.get("title")
    const termsOfServiceUrl = safeBuildUrl(
      info.get("termsOfService"),
      specUrl,
      { selectedServer }
    )
    const contactData = info.get("contact")
    const licenseData = info.get("license")
    const rawExternalDocsUrl = externalDocs && externalDocs.get("url")
    const externalDocsUrl = safeBuildUrl(rawExternalDocsUrl, specUrl, {
      selectedServer,
    })
    const externalDocsDescription =
      externalDocs && externalDocs.get("description")

    const Markdown = getComponent("Markdown", true)
    const Link = getComponent("Link")
    const VersionStamp = getComponent("VersionStamp")
    const OpenAPIVersion = getComponent("OpenAPIVersion")
    const InfoUrl = getComponent("InfoUrl")
    const InfoBasePath = getComponent("InfoBasePath")
    const License = getComponent("License")
    const Contact = getComponent("Contact")

    return (
      <div className="info">
        <hgroup className="main">
          <h2 className="title">
            {title}
            <span>
              {version && <VersionStamp version={version} />}
              <OpenAPIVersion oasVersion="2.0" />
            </span>
          </h2>
          {host || basePath ? (
            <InfoBasePath host={host} basePath={basePath} />
          ) : null}
          {url && <InfoUrl getComponent={getComponent} url={url} />}
        </hgroup>

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

        {contactData?.size > 0 && (
          <Contact
            getComponent={getComponent}
            data={contactData}
            selectedServer={selectedServer}
            url={url}
          />
        )}
        {licenseData?.size > 0 && (
          <License
            getComponent={getComponent}
            license={licenseData}
            selectedServer={selectedServer}
            url={url}
          />
        )}
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
}

export default Info
