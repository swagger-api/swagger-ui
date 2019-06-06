import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

import { sanitizeUrl } from "core/utils"
import { Contact, License } from "components/info"

export default class Info extends React.Component {
  static propTypes = {
    info: PropTypes.object,
    url: PropTypes.string,
    host: PropTypes.string,
    basePath: PropTypes.string,
    externalDocs: ImPropTypes.map,
    getComponent: PropTypes.func.isRequired,
  }

  render() {
    let { info, url, host, basePath, getComponent, externalDocs } = this.props
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
          <h2 className="title" >
            <span>{ title }</span>
            { version && <VersionStamp version={version}></VersionStamp> }
          </h2>
          { host || basePath ? <InfoBasePath host={ host } basePath={ basePath } /> : null }
          { url && <InfoUrl getComponent={getComponent} url={url} /> }
        </hgroup>

        <div className="description">
          <Markdown source={ description } />
        </div>

        {
          termsOfService && <div className="info__tos">
            <Link target="_blank" href={ sanitizeUrl(termsOfService) }>Terms of service</Link>
          </div>
        }

        {contact && contact.size ? <Contact getComponent={getComponent} data={ contact } /> : null }
        {license && license.size ? <License getComponent={getComponent} license={ license } /> : null }
        { externalDocsUrl ?
            <Link className="info__extdocs" target="_blank" href={sanitizeUrl(externalDocsUrl)}>{externalDocsDescription || externalDocsUrl}</Link>
        : null }

      </div>
    )
  }

}