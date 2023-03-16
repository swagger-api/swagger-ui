import React from "react"
import PropTypes from "prop-types"
import { fromJS } from "immutable"
import ImPropTypes from "react-immutable-proptypes"

// Todo: nice to have: similar to operation-tags, could have an expand/collapse button
// to show/hide all webhook items
const Webhooks = (props) => {
  const { specSelectors, getComponent, specPath } = props

  const webhooksPathItems = specSelectors.webhooks()
  if (!webhooksPathItems || webhooksPathItems?.size < 1) {
    return null
  }
  const OperationContainer = getComponent("OperationContainer", true)

  const pathItemsElements = webhooksPathItems.entrySeq().map(([pathItemName, pathItem], i) => {
    const operationsElements = pathItem.entrySeq().map(([operationMethod, operation], j) => {
      const op = fromJS({
        operation
      })
      // using defaultProps for `specPath`; may want to remove from props
      // and/or if extract to separate PathItem component, allow for use
      // with both OAS3.1 "webhooks" and "components.pathItems" features
      return <OperationContainer
        {...props}
        op={op}
        key={`${pathItemName}--${operationMethod}--${j}`}
        tag={""}
        method={operationMethod}
        path={pathItemName}
        specPath={specPath.push("webhooks", pathItemName, operationMethod)}
        allowTryItOut={false}
      />
    })
    return <div key={`${pathItemName}-${i}`}>
      {operationsElements}
    </div>
  })

  return (
    <div className="webhooks">
      <h2>Webhooks</h2>
      {pathItemsElements}
    </div>
  )
}

Webhooks.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  specPath: ImPropTypes.list,
}

Webhooks.defaultProps = {
  specPath: fromJS([])
}

export default Webhooks
