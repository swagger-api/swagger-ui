import React, { PureComponent } from "react"
import PropTypes from "prop-types"

export default class OperationHeader extends PureComponent {
  static propTypes = {
    description: PropTypes.object,
    deprecated: PropTypes.bool,
    isLoading: PropTypes.bool,
    externalDocs: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    const {
      description,
      deprecated,
      externalDocs,
      getComponent,
      isLoading,
    } = this.props

    const OperationExtDocsDesc = getComponent( "OperationExtDocsDesc" )
    const OperationDesc = getComponent( "OperationDesc" )

    const showOpDesc = !!description
    const showDeprecated = !!deprecated
    const showExtDocsDesc = !!externalDocs && !!externalDocs.url

    return (
      <div className="opblock-body__header">
        { 
          isLoading &&
            <img
              height={"32px"}
              width={"32px"}
              src={require("core/../img/rolling-load.svg")}
              className="opblock-loading-animation"
            />
        }
        { 
          showDeprecated &&
            <h4 className="opblock-title_normal">
              Warning: Deprecated
            </h4>
        }
        { 
          showOpDesc &&
            <OperationDesc
              description={ description }
              getComponent={ getComponent }
            />
        }
        {
          showExtDocsDesc &&
            <OperationExtDocsDesc
              externalDocs={ externalDocs }
              getComponent={ getComponent }
            />
        }
      </div>
    )
  }
}