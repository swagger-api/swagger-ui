import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

export default class Auths extends React.Component {
  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    schema: ImPropTypes.orderedMap.isRequired,
    name: PropTypes.string.isRequired,
    onAuthChange: PropTypes.func.isRequired,
    authorized: ImPropTypes.orderedMap.isRequired
  }

  render() {
    let {
      schema,
      name,
      getComponent,
      onAuthChange,
      authorized,
      errSelectors
    } = this.props
    const ApiKeyAuth = getComponent("apiKeyAuth")
    const BasicAuth = getComponent("basicAuth")

    let authEl

    const type = schema.get("type")

    switch(type) {
      case "apiKey": authEl = <ApiKeyAuth key={ name }
                                        schema={ schema }
                                        name={ name }
                                        errSelectors={ errSelectors }
                                        authorized={ authorized }
                                        getComponent={ getComponent }
                                        onChange={ onAuthChange } />
        break
      case "basic": authEl = <BasicAuth key={ name }
                                      schema={ schema }
                                      name={ name }
                                      errSelectors={ errSelectors }
                                      authorized={ authorized }
                                      getComponent={ getComponent }
                                      onChange={ onAuthChange } />
        break
      default: authEl = <div className="auth_row" key={ name }>
        <p>Unknown security definition type { type }</p>
      </div>
    }

    return (<div key={`${name}-jump`}>
      { authEl }
    </div>)
  }
}
