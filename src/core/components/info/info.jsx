import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"

import { Contact, License, TermsOfService, ExternalDocsUrl } from "components/info"

export default class Info extends React.Component {
  static propTypes = {
    info: PropTypes.object,
    title: PropTypes.any,
    description: PropTypes.any,
    version: PropTypes.any,
    url: PropTypes.string,
    host: PropTypes.string,
    basePath: PropTypes.string,
    externalDocs: ImPropTypes.map,
    getComponent: PropTypes.func.isRequired,
  }

  state = {
    expanded: true
  }

  toggleInfo = () => this.setState({ expanded: !this.state.expanded })
  
  render() {
    const { info, url, host, basePath, getComponent, externalDocs } = this.props
    const version = info.get("version")
    const description = info.get("description")
    const title = info.get("title")
    const contact = info.get("contact")
    const license = info.get("license")
    const termsOfService = info.get("termsOfService")

    const { url:externalDocsUrl, description:externalDocsDescription } = (externalDocs || fromJS({})).toJS()

    const Markdown = getComponent("Markdown")
    const VersionStamp = getComponent("VersionStamp")
    const InfoUrl = getComponent("InfoUrl")
    const InfoBasePath = getComponent("InfoBasePath")
    const Collapse = getComponent("Collapse")
    const Button = getComponent("Button")
    const Icon = getComponent("Icon")

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
        <Button unstyled onClick={this.toggleInfo} className="sui-btn-transparent collapsable-info__icon">
          <Icon
            icon={cx({
              "angle-down-light": this.state.expanded,
              "angle-up-light": !this.state.expanded
            })}
          />
        </Button>
        <Collapse isOpened={this.state.expanded} animated={true} >
          <div className="description">
            <Markdown source={ description } />
          </div>
          { !!termsOfService && <TermsOfService getComponent={getComponent} termsOfService={termsOfService} /> }
          { !!showContact && <Contact getComponent={getComponent} data={contact} /> }
          { !!showLicense && <License getComponent={getComponent} license={license} /> }
          { !!externalDocsUrl && <ExternalDocsUrl getComponent={getComponent} url={externalDocsUrl} description={externalDocsDescription} /> }             
        </Collapse>
      </div>
    )
  }
}