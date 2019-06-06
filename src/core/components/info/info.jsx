import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

import { sanitizeUrl } from "core/utils"
import { Contact, License } from "components/info"
import { Contact, License, TermsOfService } from "components/info"

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
    const { info, url, host, basePath, getComponent, externalDocs } = this.props
    const version = info.get("version")
    const description = info.get("description")
    const title = info.get("title")
    const contact = info.get("contact")
    const license = info.get("license")
    const { url:externalDocsUrl, description:externalDocsDescription } = (externalDocs || fromJS({})).toJS()

    const Markdown = getComponent("Markdown")
    const Link = getComponent("Link")
    const VersionStamp = getComponent("VersionStamp")
    const InfoUrl = getComponent("InfoUrl")
    const InfoBasePath = getComponent("InfoBasePath")
    const showVersion = !!version && !!this.state.expanded
    const showInfoBasePath = (!!host || !!basePath) && !!this.state.expanded
    const showInfoUrl = !!url && !!this.state.expanded
    const showContact = !!contact && !!contact.size
    const showLicense = !!license && !!license.size

    return (
      <div className="info">
        <hgroup className="main">
          <h2 className="title" >
            <span>{ title }</span>
            { showVersion && <VersionStamp version={version}></VersionStamp> }
          </h2>
          { showInfoBasePath && <InfoBasePath host={ host } basePath={ basePath } /> }
          { showInfoUrl && <InfoUrl getComponent={getComponent} url={url} /> }
        </hgroup>

        <div className="description">
          <Markdown source={ description } />
        </div>

          </div>
          { !!termsOfService && <TermsOfService getComponent={getComponent} termsOfService={termsOfService} /> }
          { !!showContact && <Contact getComponent={getComponent} data={ contact } /> }
          { !!showLicense && <License getComponent={getComponent} license={ license } /> }
          { 
            !!externalDocsUrl 
              &&  <Link
                    className="info__extdocs"
                    target="_blank"
                    href={sanitizeUrl(externalDocsUrl)}
                  >
                    {externalDocsDescription || externalDocsUrl}
                  </Link>
          }
      </div>
    )
  }

}