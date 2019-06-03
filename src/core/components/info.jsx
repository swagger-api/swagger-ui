import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import { sanitizeUrl } from "core/utils"


export class InfoBasePath extends React.Component {
  static propTypes = {
    host: PropTypes.string,
    basePath: PropTypes.string,
    translate: PropTypes.func.isRequired
  }

  render() {
    let { host, basePath, translate } = this.props

    return (
      <pre className="base-url">
        {"["} { translate("info.baseUrl") } {host}{basePath} {"]"}
      </pre>
    )
  }
}


class Contact extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    getComponent: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
  }

  render(){
    let { data, getComponent, translate } = this.props
    let name = data.get("name") || translate("info.developer")
    let url = data.get("url")
    let email = data.get("email")

    const Link = getComponent("Link")

    return (
      <div className="info__contact">
        { url && <div><Link href={ sanitizeUrl(url) } target="_blank">{ translate("info.website", { name }) }</Link></div> }
        { email &&
          <Link href={sanitizeUrl(`mailto:${email}`)}>
            { url ? translate("info.sendEmail", { name }) : translate("info.contact", { name }) }
          </Link>
        }
      </div>
    )
  }
}

class License extends React.Component {
  static propTypes = {
    license: PropTypes.object,
    getComponent: PropTypes.func.isRequired

  }

  render(){
    let { license, getComponent } = this.props

    const Link = getComponent("Link")

    let name = license.get("name") || "License"
    let url = license.get("url")

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

    return <Link target="_blank" href={ sanitizeUrl(url) }><span className="url"> { url } </span></Link>
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
    translate: PropTypes.func.isRequired,
  }

  render() {
    let { info, url, host, basePath, getComponent, externalDocs, translate } = this.props
    let version = info.get("version")
    let description = info.get("description")
    let title = info.get("title")
    let termsOfService = info.get("termsOfService")
    let contact = info.get("contact")
    let license = info.get("license")
    const { url:externalDocsUrl, description:externalDocsDescription } = (externalDocs || fromJS({})).toJS()

    const Markdown = getComponent("Markdown")
    const Link = getComponent("Link")
    const VersionStamp = getComponent("VersionStamp")
    const InfoUrl = getComponent("InfoUrl")
    const InfoBasePath = getComponent("InfoBasePath")

    return (
      <div className="info">
        <hgroup className="main">
          <h2 className="title" >{ title }
            { version && <VersionStamp version={version} translate={translate}></VersionStamp> }
          </h2>
          { host || basePath ? <InfoBasePath host={ host } basePath={ basePath } translate={ translate } /> : null }
          { url && <InfoUrl getComponent={getComponent} url={url} /> }
        </hgroup>

        <div className="description">
          <Markdown source={ description } />
        </div>

        {
          termsOfService && <div className="info__tos">
            <Link target="_blank" href={ sanitizeUrl(termsOfService) }>{ translate("info.termsOfService") }</Link>
          </div>
        }

        {contact && contact.size ? <Contact getComponent={getComponent} translate={translate} data={ contact } /> : null }
        {license && license.size ? <License getComponent={getComponent} translate={translate} license={ license } /> : null }
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
