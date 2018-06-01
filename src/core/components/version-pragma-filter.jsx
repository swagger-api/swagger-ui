import React from "react"
import PropTypes from "prop-types"

export default class VersionPragmaFilter extends React.PureComponent {
  static propTypes = {
    isSwagger2: PropTypes.bool.isRequired,
    isOAS3: PropTypes.bool.isRequired,
    bypass: PropTypes.bool,
    alsoShow: PropTypes.element,
    children: PropTypes.any,
  }

  static defaultProps = {
    alsoShow: null,
    children: null,
    bypass: false,
  }

  render() {
    const { bypass, isSwagger2, isOAS3, alsoShow } = this.props

    if(bypass) {
      return <div>{ this.props.children }</div>
    }

    if(isSwagger2 && isOAS3) {
      return <div className="version-pragma">
        {alsoShow}
        <div className="version-pragma__message version-pragma__message--ambiguous">
          <div>
            <h3>Unable to render this definition</h3>
            <p><code>swagger</code> and <code>openapi</code> fields cannot be present in the same Swagger or OpenAPI definition. Please remove one of the fields.</p>
            <p>Supported version fields are <code>swagger: {"\"2.0\""}</code> and those that match <code>openapi: 3.0.n</code> (for example, <code>openapi: 3.0.0</code>).</p>
          </div>
        </div>
      </div>
    }

    if(!isSwagger2 && !isOAS3) {
      return <div className="version-pragma">
        {alsoShow}
        <div className="version-pragma__message version-pragma__message--missing">
          <div>
            <h3>Unable to render this definition</h3>
            <p>The provided definition does not specify a valid version field.</p>
            <p>Please indicate a valid Swagger or OpenAPI version field. Supported version fields are <code>swagger: {"\"2.0\""}</code> and those that match <code>openapi: 3.0.n</code> (for example, <code>openapi: 3.0.0</code>).</p>
          </div>
        </div>
      </div>
    }

    return <div>{ this.props.children }</div>
  }
}
