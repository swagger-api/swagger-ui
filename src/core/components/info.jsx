import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import { sanitizeUrl } from "core/utils"
import { safeBuildUrl } from "core/utils/url"


export class InfoBasePath extends React.Component {
  static propTypes = {
    host: PropTypes.string,
    basePath: PropTypes.string
  }

  render() {
    let { host, basePath } = this.props

    return (
      <pre className="base-url">
        [ Base URL: {host}{basePath} ]
      </pre>
    )
  }
}


class Contact extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    selectedServer: PropTypes.string,
    url: PropTypes.string.isRequired,
  }

  render(){
    let { data, getComponent, selectedServer, url: specUrl} = this.props
    let name = data.get("name") || "the developer"
    let url = safeBuildUrl(data.get("url"), specUrl, {selectedServer})
    let email = data.get("email")

    const Link = getComponent("Link")

    return (
      <div className="info__contact">
        { url && <div><Link href={ sanitizeUrl(url) } target="_blank">{ name } - Website</Link></div> }
        { email &&
          <Link href={sanitizeUrl(`mailto:${email}`)}>
            { url ? `Send email to ${name}` : `Contact ${name}`}
          </Link>
        }
      </div>
    )
  }
}

class License extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    specSelectors: PropTypes.object.isRequired,
    selectedServer: PropTypes.string,
    url: PropTypes.string.isRequired,
  }

  render(){
    let { license, getComponent, selectedServer, url: specUrl } = this.props

    const Link = getComponent("Link")
    let name = license.get("name") || "License"
    let url = safeBuildUrl(license.get("url"), specUrl, {selectedServer})

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

export class InfoUrl extends React.PureComponent {
  static propTypes = {
    url: PropTypes.string.isRequired,
    getComponent: PropTypes.func.isRequired
  }


  render() {
    const { url, getComponent } = this.props

    const Link = getComponent("Link")

    return <Link target="_blank" href={ sanitizeUrl(url) }><span className="url"> { url }</span></Link>
  }
}

export default class Info extends React.Component {
  static propTypes = {
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
    let { info, url, host, basePath, getComponent, externalDocs, selectedServer, url: specUrl } = this.props
    let version = info.get("version")
    let description = info.get("description")
    let title = info.get("title")
    let termsOfServiceUrl = safeBuildUrl(info.get("termsOfService"), specUrl, {selectedServer})
    let contact = info.get("contact")
    let license = info.get("license")
    let rawExternalDocsUrl = externalDocs && externalDocs.get("url")
    let externalDocsUrl = safeBuildUrl(rawExternalDocsUrl, specUrl, {selectedServer})
    let externalDocsDescription = externalDocs && externalDocs.get("description")

    const Markdown = getComponent("Markdown", true)
    const Link = getComponent("Link")
    const VersionStamp = getComponent("VersionStamp")
    const InfoUrl = getComponent("InfoUrl")
    const InfoBasePath = getComponent("InfoBasePath")

    return (
      <div className="info">
        <hgroup className="main">
          <h2 className="title" >{ title }
            { version && <VersionStamp version={version}></VersionStamp> }
          </h2>
          { host || basePath ? <InfoBasePath host={ host } basePath={ basePath } /> : null }
          { url && <InfoUrl getComponent={getComponent} url={url} /> }
        </hgroup>

        <div className="description">
          <Markdown source={ description } />
        </div>

        {
          termsOfServiceUrl && <div className="info__tos">
            <Link target="_blank" href={ sanitizeUrl(termsOfServiceUrl) }>Terms of service</Link>
          </div>
        }

        {contact && contact.size ? <Contact getComponent={getComponent} data={ contact } selectedServer={selectedServer} url={url} /> : null }
        {license && license.size ? <License getComponent={getComponent} license={ license } selectedServer={selectedServer} url={url}/> : null }
        { externalDocsUrl ?
            <Link className="info__extdocs" target="_blank" href={sanitizeUrl(externalDocsUrl)}>{externalDocsDescription || externalDocsUrl}</Link>
        : null }

      </div>
    )
  }

}

Info.propTypes = {
  title: PropTypes.any,
  description: PropTypes.any,
  version: PropTypes.any,
  url: PropTypes.string
}
