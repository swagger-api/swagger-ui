import React from "react"
import PropTypes from "prop-types"

export default class InfoContainer extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
  }

  render () {
    const {specSelectors, getComponent} = this.props

    const info = specSelectors.info()
    const url = specSelectors.url()
    const basePath = specSelectors.basePath()
    const host = specSelectors.host()
    const externalDocs = specSelectors.externalDocs()

    const Info = getComponent("info")

    return (
      <div>
        {info && info.count() ? (
          <Info info={info} url={url} host={host} basePath={basePath} externalDocs={externalDocs}
                getComponent={getComponent}/>
        ) : null}
      </div>
    )
  }
}
