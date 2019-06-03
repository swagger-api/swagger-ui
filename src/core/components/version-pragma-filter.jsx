import React from "react"
import PropTypes from "prop-types"

export default class VersionPragmaFilter extends React.PureComponent {
  static propTypes = {
    isSwagger2: PropTypes.bool.isRequired,
    isOAS3: PropTypes.bool.isRequired,
    bypass: PropTypes.bool,
    alsoShow: PropTypes.element,
    children: PropTypes.any,
    translate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    alsoShow: null,
    children: null,
    bypass: false,
  }

  render() {
    const { bypass, isSwagger2, isOAS3, alsoShow, translate } = this.props

    if(bypass) {
      return <div>{ this.props.children }</div>
    }

    if(isSwagger2 && isOAS3) {
      return <div className="version-pragma">
        {alsoShow}
        <div className="version-pragma__message version-pragma__message--ambiguous">
          <div>
            <h3>{translate("versionPragma.header")}</h3>
            <p>
              {translate("versionPragma.conflict.1")}
              <code>{"swagger"}</code>
              {translate("versionPragma.conflict.2")}
              <code>{"openapi"}</code>
              {translate("versionPragma.conflict.3")}
            </p>
            <p>
              {translate("versionPragma.supported.1")}
              <code>{"swagger:"} {"\"2.0\""}</code>
              {translate("versionPragma.supported.2")}
              <code>{"openapi: 3.0.n"}</code>
              {translate("versionPragma.supported.3")}
              <code>{"openapi: 3.0.0"}</code>
              {translate("versionPragma.supported.4")}
            </p>
          </div>
        </div>
      </div>
    }

    if(!isSwagger2 && !isOAS3) {
      return <div className="version-pragma">
        {alsoShow}
        <div className="version-pragma__message version-pragma__message--missing">
          <div>
            <h3>{translate("versionPragma.header")}</h3>
            <p>{translate("versionPragma.noValidVersion")}</p>
            <p>
              {translate("versionPragma.needValid")}
              {" "}
              {translate("versionPragma.supported.1")}
              <code>{"swagger:"} {"\"2.0\""}</code>
              {translate("versionPragma.supported.2")}
              <code>{"openapi: 3.0.n"}</code>
              {translate("versionPragma.supported.3")}
              <code>{"openapi: 3.0.0"}</code>
              {translate("versionPragma.supported.4")}
            </p>
          </div>
        </div>
      </div>
    }

    return <div>{ this.props.children }</div>
  }
}
